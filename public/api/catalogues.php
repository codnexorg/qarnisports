<?php
declare(strict_types=1);

require_once __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function catalogue_slug(string $value): string
{
    $value = strtolower(trim($value));
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    $value = trim($value, '-');
    return $value !== '' ? $value : bin2hex(random_bytes(4));
}

function catalogue_from_row(array $row): array
{
    $categoryIds = [];
    if (!empty($row['category_ids'])) {
        $decoded = json_decode((string) $row['category_ids'], true);
        if (is_array($decoded)) {
            $categoryIds = $decoded;
        }
    }
    
    return [
        'id' => (string) $row['id'],
        'title' => (string) $row['title'],
        'category' => (string) $row['category'],
        'year' => (int) $row['year'],
        'description' => (string) $row['description'],
        'fileUrl' => (string) $row['file_url'],
        'fileName' => (string) $row['file_name'],
        'fileSize' => (int) $row['file_size'],
        'coverImage' => (string) ($row['cover_image'] ?? ''),
        'categoryIds' => $categoryIds,
        'sortOrder' => (int) $row['sort_order'],
        'createdAt' => date(DATE_ATOM, strtotime((string) $row['created_at'])),
    ];
}

function ensure_catalogues_table(PDO $pdo): void
{
    $existsStmt = $pdo->query("SHOW TABLES LIKE 'catalogues'");
    $exists = (bool) $existsStmt->fetchColumn();

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS catalogues (
            id varchar(64) NOT NULL,
            title varchar(255) NOT NULL,
            category varchar(120) NOT NULL DEFAULT 'Catalogue',
            year int NOT NULL,
            description text NOT NULL,
            file_url varchar(500) NOT NULL,
            file_name varchar(255) NOT NULL,
            file_size bigint unsigned NOT NULL DEFAULT 0,
            cover_image varchar(500) NULL,
            category_ids json NULL,
            sort_order int NOT NULL DEFAULT 0,
            created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_catalogues_sort_order (sort_order),
            KEY idx_catalogues_year (year)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $col1Exists = (bool) $pdo->query("SHOW COLUMNS FROM catalogues LIKE 'cover_image'")->fetchColumn();
    if (!$col1Exists) {
        $pdo->exec("ALTER TABLE catalogues ADD COLUMN cover_image varchar(500) NULL AFTER file_size");
    }
    
    $col2Exists = (bool) $pdo->query("SHOW COLUMNS FROM catalogues LIKE 'category_ids'")->fetchColumn();
    if (!$col2Exists) {
        $pdo->exec("ALTER TABLE catalogues ADD COLUMN category_ids json NULL AFTER cover_image");
    }

    if ($exists) {
        return;
    }

    $seeds = [
        [
            'id' => 'sportswear-2026',
            'title' => 'Sports Catalogue',
            'category' => 'Sportswear',
            'year' => 2026,
            'description' => 'Custom sportswear, activewear, teamwear, and performance apparel catalogue for buyers and distributors.',
            'file_url' => '/catalogues/qarnisports-sportswear-catalogue-2026.pdf',
            'file_name' => 'qarnisports-sportswear-catalogue-2026.pdf',
            'file_size' => 13998647,
            'cover_image' => '/category-heroes/t-shirts.webp',
            'category_ids' => json_encode(['hoodies', 'long-sleeve-shirts', 'leggings', 'shorts', 'sports-bra', 'tank-tops']),
            'sort_order' => 1,
        ],
        [
            'id' => 'uniform-2026',
            'title' => 'Uniform Catalogue',
            'category' => 'Uniforms',
            'year' => 2026,
            'description' => 'Soccer, American football, basketball, volleyball, and team uniform manufacturing catalogue.',
            'file_url' => '/catalogues/qarnisports-uniform-catalogue-2026.pdf',
            'file_name' => 'qarnisports-uniform-catalogue-2026.pdf',
            'file_size' => 2736659,
            'cover_image' => '/category-heroes/soccer-uniform.webp',
            'category_ids' => json_encode(['soccer-uniform', 'american-football-uniform', 'basketball-uniform', 'volleyball-uniform']),
            'sort_order' => 2,
        ],
        [
            'id' => 'apparel-2025',
            'title' => 'Apparel Catalogue',
            'category' => 'Apparel',
            'year' => 2025,
            'description' => 'Apparel and cut-and-sew performance products catalogue for custom orders.',
            'file_url' => '/catalogues/qarnisports-apparel-accessories-catalogue-2025.pdf',
            'file_name' => 'qarnisports-apparel-accessories-catalogue-2025.pdf',
            'file_size' => 11379704,
            'cover_image' => '/category-heroes/t-shirts.webp',
            'category_ids' => json_encode(['t-shirts', 'hoodies', 'long-sleeve-shirts', 'leggings', 'shorts']),
            'sort_order' => 3,
        ],
        [
            'id' => 'accessories-2026',
            'title' => 'Accessories Catalogue 2026',
            'category' => 'Accessories',
            'year' => 2026,
            'description' => 'Complete range of sports accessories including bags, bandages, hats, sports bags, and soccer balls.',
            'file_url' => '/catalogues/QarniSports_Accessories_Catalogue_2026.pdf',
            'file_name' => 'QarniSports_Accessories_Catalogue_2026.pdf',
            'file_size' => 1071465,
            'cover_image' => '/category-heroes/accessories-catalogue.jpg.png',
            'category_ids' => json_encode(['accessories', 'bags', 'bandages', 'hats', 'sports-bags', 'soccer-ball']),
            'sort_order' => 4,
        ],
    ];

    $stmt = $pdo->prepare(
        'INSERT INTO catalogues (id, title, category, year, description, file_url, file_name, file_size, cover_image, category_ids, sort_order)
         VALUES (:id, :title, :category, :year, :description, :file_url, :file_name, :file_size, :cover_image, :category_ids, :sort_order)'
    );
    foreach ($seeds as $seed) {
        $stmt->execute($seed);
    }
}

function delete_uploaded_catalogue_file(?string $url): void
{
    if ($url === null || $url === '') {
        return;
    }

    $path = parse_url($url, PHP_URL_PATH);
    if (!is_string($path) || !str_starts_with($path, '/upload/catalogues/')) {
        return;
    }

    $filename = basename(rawurldecode($path));
    if ($filename === '' || $filename === '.' || $filename === '..') {
        return;
    }

    $target = dirname(__DIR__) . '/upload/catalogues/' . $filename;
    if (is_file($target)) {
        @unlink($target);
    }
}

try {
    $pdo = db();
    ensure_catalogues_table($pdo);

    if ($method === 'GET') {
        $rows = $pdo
            ->query('SELECT * FROM catalogues ORDER BY sort_order ASC, year DESC, created_at DESC')
            ->fetchAll();
        json_response(['data' => array_map('catalogue_from_row', $rows)]);
    }

    require_admin();

    if ($method === 'POST') {
        if (empty($_FILES['catalogue']) || !is_array($_FILES['catalogue'])) {
            json_response(['error' => 'No PDF catalogue uploaded.'], 422);
        }

        $file = $_FILES['catalogue'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            json_response(['error' => 'Catalogue upload failed.'], 422);
        }

        $tmpName = (string) ($file['tmp_name'] ?? '');
        if ($tmpName === '' || !is_uploaded_file($tmpName)) {
            json_response(['error' => 'Invalid upload.'], 422);
        }

        $maxBytes = 30 * 1024 * 1024;
        $fileSize = (int) ($file['size'] ?? 0);
        if ($fileSize <= 0 || $fileSize > $maxBytes) {
            json_response(['error' => 'PDF must be 30MB or smaller.'], 422);
        }

        $extension = strtolower(pathinfo((string) ($file['name'] ?? ''), PATHINFO_EXTENSION));
        $header = file_get_contents($tmpName, false, null, 0, 4);
        if ($extension !== 'pdf' || $header !== '%PDF') {
            json_response(['error' => 'Only PDF catalogues are allowed.'], 422);
        }

        $title = clean_string($_POST['title'] ?? pathinfo((string) ($file['name'] ?? 'Catalogue'), PATHINFO_FILENAME), 255);
        if ($title === '') {
            json_response(['error' => 'Catalogue title is required.'], 422);
        }

        $category = clean_string($_POST['category'] ?? 'Catalogue', 120);
        $year = max(2000, min(2100, (int) ($_POST['year'] ?? date('Y'))));
        $description = clean_string($_POST['description'] ?? '', 2000);
        $sortOrder = (int) ($_POST['sortOrder'] ?? 0);
        $categoryIdsJson = $_POST['categoryIds'] ?? null;

        $uploadDir = dirname(__DIR__) . '/upload/catalogues';
        if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
            json_response(['error' => 'Could not create catalogue upload folder.'], 500);
        }

        $filename = catalogue_slug($title) . '-' . date('YmdHis') . '-' . bin2hex(random_bytes(4)) . '.pdf';
        $target = $uploadDir . '/' . $filename;
        if (!move_uploaded_file($tmpName, $target)) {
            json_response(['error' => 'Could not save uploaded catalogue.'], 500);
        }
        chmod($target, 0644);

        $coverImage = null;
        if (!empty($_FILES['coverImage']) && is_array($_FILES['coverImage'])) {
            $cFile = $_FILES['coverImage'];
            if (($cFile['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK) {
                $cTmpName = (string) ($cFile['tmp_name'] ?? '');
                $cExtension = strtolower(pathinfo((string) ($cFile['name'] ?? ''), PATHINFO_EXTENSION));
                if (in_array($cExtension, ['jpg', 'jpeg', 'png', 'webp', 'gif'])) {
                    $cFilename = 'cover-' . catalogue_slug($title) . '-' . bin2hex(random_bytes(4)) . '.' . $cExtension;
                    $cTarget = $uploadDir . '/' . $cFilename;
                    if (move_uploaded_file($cTmpName, $cTarget)) {
                        chmod($cTarget, 0644);
                        $coverImage = '/upload/catalogues/' . $cFilename;
                    }
                }
            }
        }

        $id = bin2hex(random_bytes(16));
        $stmt = $pdo->prepare(
            'INSERT INTO catalogues (id, title, category, year, description, file_url, file_name, file_size, cover_image, category_ids, sort_order)
             VALUES (:id, :title, :category, :year, :description, :file_url, :file_name, :file_size, :cover_image, :category_ids, :sort_order)'
        );
        $stmt->execute([
            'id' => $id,
            'title' => $title,
            'category' => $category !== '' ? $category : 'Catalogue',
            'year' => $year,
            'description' => $description,
            'file_url' => '/upload/catalogues/' . $filename,
            'file_name' => $filename,
            'file_size' => $fileSize,
            'cover_image' => $coverImage,
            'category_ids' => $categoryIdsJson,
            'sort_order' => $sortOrder,
        ]);

        $stmt = $pdo->prepare('SELECT * FROM catalogues WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        json_response(['data' => catalogue_from_row($stmt->fetch())], 201);
    }

    if ($method === 'DELETE') {
        $body = request_json();
        $id = clean_string($body['id'] ?? ($_GET['id'] ?? ''), 64);
        if ($id === '') {
            json_response(['error' => 'Catalogue id is required.'], 422);
        }

        $stmt = $pdo->prepare('SELECT * FROM catalogues WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();

        $stmt = $pdo->prepare('DELETE FROM catalogues WHERE id = :id');
        $stmt->execute(['id' => $id]);

        if ($row) {
            delete_uploaded_catalogue_file($row['file_url'] === null ? null : (string) $row['file_url']);
        }

        json_response(['ok' => true]);
    }

    json_response(['error' => 'Method not allowed.'], 405);
} catch (Throwable $e) {
    json_response(['error' => 'Server error.', 'detail' => $e->getMessage()], 500);
}
