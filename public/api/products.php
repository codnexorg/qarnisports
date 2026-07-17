<?php
declare(strict_types=1);

require_once __DIR__ . '/lib.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

try {
    if ($method === 'GET') {
        $pdo = db();
        $id = isset($_GET['id']) ? clean_string($_GET['id'], 64) : '';

        if ($id !== '') {
            $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch();
            json_response(['data' => $row ? product_from_row($row) : null]);
        }

        $where = [];
        $params = [];

        if (!empty($_GET['sport'])) {
            $where[] = 'sport = :sport';
            $params['sport'] = clean_string($_GET['sport'], 64);
        }

        if (!empty($_GET['featured'])) {
            $where[] = 'is_featured = 1';
        }

        if (!empty($_GET['exclude_id'])) {
            $where[] = 'id <> :exclude_id';
            $params['exclude_id'] = clean_string($_GET['exclude_id'], 64);
        }

        $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 100;
        $sql = 'SELECT * FROM products';
        if ($where !== []) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY is_featured DESC, created_at DESC LIMIT ' . $limit;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = array_map('product_from_row', $stmt->fetchAll());
        json_response(['data' => $rows]);
    }

    require_admin();
    $pdo = db();
    $body = request_json();

    if ($method === 'POST') {
        $payload = product_payload($body);
        $payload['id'] = bin2hex(random_bytes(16));

        $stmt = $pdo->prepare(
            'INSERT INTO products (id, name, sport, price, original_price, image, badge, rating, reviews, description, long_description, features, colors, sizes, sku, in_stock, sale_end_time, is_featured)
             VALUES (:id, :name, :sport, :price, :original_price, :image, :badge, :rating, :reviews, :description, :long_description, :features, :colors, :sizes, :sku, :in_stock, :sale_end_time, :is_featured)'
        );
        $stmt->execute($payload);

        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $payload['id']]);
        json_response(['data' => product_from_row($stmt->fetch())], 201);
    }

    if ($method === 'PUT') {
        $id = clean_string($body['id'] ?? '', 64);
        if ($id === '') {
            json_response(['error' => 'Product id is required.'], 422);
        }

        $payload = product_payload($body);
        $payload['id'] = $id;

        $stmt = $pdo->prepare(
            'UPDATE products SET
                name = :name,
                sport = :sport,
                price = :price,
                original_price = :original_price,
                image = :image,
                badge = :badge,
                rating = :rating,
                reviews = :reviews,
                description = :description,
                long_description = :long_description,
                features = :features,
                colors = :colors,
                sizes = :sizes,
                sku = :sku,
                in_stock = :in_stock,
                sale_end_time = :sale_end_time,
                is_featured = :is_featured
             WHERE id = :id'
        );
        $stmt->execute($payload);

        $stmt = $pdo->prepare('SELECT * FROM products WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        json_response(['data' => $row ? product_from_row($row) : null]);
    }

    if ($method === 'DELETE') {
        $id = clean_string($body['id'] ?? ($_GET['id'] ?? ''), 64);
        if ($id === '') {
            json_response(['error' => 'Product id is required.'], 422);
        }

        $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
        $stmt->execute(['id' => $id]);
        json_response(['ok' => true]);
    }

    json_response(['error' => 'Method not allowed.'], 405);
} catch (Throwable $e) {
    json_response(['error' => 'Server error.', 'detail' => $e->getMessage()], 500);
}
