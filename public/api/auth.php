<?php
declare(strict_types=1);

require_once __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    json_response([
        'authenticated' => is_admin(),
        'csrfToken' => is_admin() ? csrf_token() : null,
    ]);
}

if ($method !== 'POST') {
    json_response(['error' => 'Method not allowed.'], 405);
}

$body = request_json();
$action = (string) ($body['action'] ?? 'login');

if ($action === 'logout') {
    if (is_admin()) {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!hash_equals(csrf_token(), $token)) {
            json_response(['error' => 'Invalid CSRF token.'], 403);
        }
    }
    $_SESSION = [];
    session_destroy();
    json_response(['authenticated' => false]);
}

$password = (string) ($body['password'] ?? '');
if (!verify_admin_password($password)) {
    json_response(['error' => 'Incorrect password.'], 401);
}

session_regenerate_id(true);
$_SESSION['admin_authenticated'] = true;
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

json_response([
    'authenticated' => true,
    'csrfToken' => csrf_token(),
]);
