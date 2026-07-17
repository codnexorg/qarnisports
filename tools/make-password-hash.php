<?php
declare(strict_types=1);

$password = $argv[1] ?? '';

if ($password === '') {
    fwrite(STDERR, "Usage: php tools/make-password-hash.php \"new-password\"\n");
    exit(1);
}

$iterations = 210000;
$salt = bin2hex(random_bytes(16));
$hash = hash_pbkdf2('sha256', $password, $salt, $iterations, 64, false);

echo 'pbkdf2_sha256$' . $iterations . '$' . $salt . '$' . $hash . PHP_EOL;
