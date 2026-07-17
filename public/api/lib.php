<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function json_response(mixed $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function request_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_response(['error' => 'Invalid JSON body.'], 400);
    }
    return $data;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return (string) $_SESSION['csrf_token'];
}

function is_admin(): bool
{
    return !empty($_SESSION['admin_authenticated']);
}

function require_admin(): void
{
    if (!is_admin()) {
        json_response(['error' => 'Unauthorized.'], 401);
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        if (!hash_equals(csrf_token(), $token)) {
            json_response(['error' => 'Invalid CSRF token.'], 403);
        }
    }
}

function verify_admin_password(string $password): bool
{
    $parts = explode('$', ADMIN_PASSWORD_HASH);
    if (count($parts) !== 4 || $parts[0] !== 'pbkdf2_sha256') {
        return false;
    }

    [, $iterations, $salt, $expected] = $parts;
    $actual = hash_pbkdf2('sha256', $password, $salt, (int) $iterations, strlen($expected), false);
    return hash_equals($expected, $actual);
}

function decode_json_field(mixed $value, array $fallback = []): array
{
    if (!is_string($value) || $value === '') {
        return $fallback;
    }
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : $fallback;
}

function product_from_row(array $row): array
{
    return [
        'id' => (string) $row['id'],
        'name' => (string) $row['name'],
        'sport' => (string) $row['sport'],
        'price' => (int) $row['price'],
        'originalPrice' => $row['original_price'] === null ? null : (int) $row['original_price'],
        'image' => (string) $row['image'],
        'badge' => $row['badge'] === null ? null : (string) $row['badge'],
        'rating' => (float) $row['rating'],
        'reviews' => (int) $row['reviews'],
        'description' => (string) $row['description'],
        'longDescription' => $row['long_description'] === null ? null : (string) $row['long_description'],
        'features' => decode_json_field($row['features']),
        'colors' => decode_json_field($row['colors']),
        'sizes' => decode_json_field($row['sizes']),
        'sku' => $row['sku'] === null ? null : (string) $row['sku'],
        'inStock' => (bool) $row['in_stock'],
        'saleEndTime' => $row['sale_end_time'] === null ? null : date(DATE_ATOM, strtotime((string) $row['sale_end_time'])),
        'isFeatured' => (bool) $row['is_featured'],
    ];
}

function clean_string(mixed $value, int $max = 255): string
{
    $value = trim((string) $value);
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max, 'UTF-8');
    }
    return substr($value, 0, $max);
}

function nullable_string(mixed $value, int $max = 255): ?string
{
    $value = clean_string($value, $max);
    return $value === '' ? null : $value;
}

function product_payload(array $data): array
{
    $name = clean_string($data['name'] ?? '');
    $sport = clean_string($data['sport'] ?? '');
    $price = (int) ($data['price'] ?? 0);
    $description = clean_string($data['description'] ?? '', 1000);

    if ($name === '' || $sport === '' || $price <= 0 || $description === '') {
        json_response(['error' => 'Name, sport, price, and description are required.'], 422);
    }

    $saleEnd = nullable_string($data['saleEndTime'] ?? null, 40);
    if ($saleEnd !== null) {
        $timestamp = strtotime($saleEnd);
        $saleEnd = $timestamp === false ? null : date('Y-m-d H:i:s', $timestamp);
    }

    return [
        'name' => $name,
        'sport' => $sport,
        'price' => $price,
        'original_price' => isset($data['originalPrice']) && $data['originalPrice'] !== '' ? (int) $data['originalPrice'] : null,
        'image' => clean_string($data['image'] ?? '/product-football.webp', 500),
        'badge' => nullable_string($data['badge'] ?? null),
        'rating' => max(1, min(5, (float) ($data['rating'] ?? 4.5))),
        'reviews' => max(0, (int) ($data['reviews'] ?? 0)),
        'description' => $description,
        'long_description' => nullable_string($data['longDescription'] ?? null, 5000),
        'features' => json_encode(array_values($data['features'] ?? []), JSON_UNESCAPED_SLASHES),
        'colors' => json_encode(array_values($data['colors'] ?? []), JSON_UNESCAPED_SLASHES),
        'sizes' => json_encode(array_values($data['sizes'] ?? []), JSON_UNESCAPED_SLASHES),
        'sku' => nullable_string($data['sku'] ?? null),
        'in_stock' => !empty($data['inStock']) ? 1 : 0,
        'sale_end_time' => $saleEnd,
        'is_featured' => !empty($data['isFeatured']) ? 1 : 0,
    ];
}
