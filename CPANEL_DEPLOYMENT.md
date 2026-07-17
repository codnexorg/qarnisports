# Qarni Sports cPanel Deployment

## 1. Create MySQL Database

In cPanel open **MySQL Databases** and create:

- Database
- Database user
- User password
- Add the user to the database with **All Privileges**

The final database name/user often include the cPanel prefix, for example:

```text
qarnisports_store
qarnisports_storeuser
```

## 2. Import Tables and Sample Products

Open **phpMyAdmin**, select the new database, then import:

```text
database/qarnisports_mysql.sql
```

This creates the `products` table and inserts the starter products.

## 3. Build Frontend

Run locally:

```bash
npm run build
```

Upload the contents of:

```text
dist/
```

into the domain document root, usually:

```text
public_html/
```

Do not upload `node_modules`.

## 4. Configure API

After upload, edit this file in cPanel File Manager:

```text
public_html/api/config.php
```

Set:

```php
const DB_HOST = 'localhost';
const DB_NAME = 'your_cpanel_database_name';
const DB_USER = 'your_cpanel_database_user';
const DB_PASS = 'your_database_password';
```

## 5. Change Admin Password

Current temporary password is:

```text
admin123
```

Before going live, generate a new password hash locally:

```bash
node tools/make-password-hash.mjs "your-new-password"
```

Paste the output into:

```php
const ADMIN_PASSWORD_HASH = 'paste-generated-hash-here';
```

in:

```text
public_html/api/config.php
```

## 6. Check Website

Open:

```text
https://qarnisports.com
https://qarnisports.com/admin
https://qarnisports.com/api/products.php
```

The API URL should show JSON.

## 7. Important

- Keep `api/config.php` private and never share the database password.
- Keep `.htaccess` uploaded; it prevents route refresh issues for `/admin`, `/cart`, and product pages.
- cPanel disk space is limited, so upload only `dist` contents and the SQL file if needed.
