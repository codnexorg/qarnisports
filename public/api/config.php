<?php
declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'qarnisports_db';
const DB_USER = 'qarnisports_user';
const DB_PASS = 'CHANGE_THIS_DATABASE_PASSWORD';

// Default hash is for the temporary testing password: admin123
// Change this before going live. Generate a new value with:
// node tools/make-password-hash.mjs "your-new-password"
// or: php tools/make-password-hash.php "your-new-password"
const ADMIN_PASSWORD_HASH = 'pbkdf2_sha256$210000$348b0d0cca25abc375c892924a429830$3d373bb1950ebfc1d53db89516bf046d42a3dd3ced642102bcab8d556d612f53';
