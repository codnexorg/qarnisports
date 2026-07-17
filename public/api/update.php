<?php
require 'lib.php';
$pdo = db();

$pdo->exec("UPDATE catalogues SET title = 'Sports Catalogue', category = 'Sports', category_ids = '[\"sports\", \"sports-bra\", \"tank-tops\"]', cover_image = '/category-heroes/sports-bra.webp' WHERE id = 'sportswear-2026'");
$pdo->exec("UPDATE catalogues SET title = 'Uniform Catalogue', category_ids = '[\"uniforms\", \"soccer-uniform\", \"american-football-uniform\", \"basketball-uniform\", \"volleyball-uniform\"]' WHERE id = 'uniform-2026'");

// Update Apparel catalogue and remove accessories from it
$pdo->exec("UPDATE catalogues SET id = 'apparel-2025', title = 'Apparel Catalogue', description = 'Apparel and cut-and-sew performance products catalogue for custom orders.', category_ids = '[\"apparel\", \"t-shirts\", \"hoodies\", \"long-sleeve-shirts\", \"leggings\", \"shorts\"]' WHERE id = 'apparel-accessories-2025' OR id = 'apparel-2025'");

// Insert new Accessories Catalogue
$pdo->exec("INSERT IGNORE INTO catalogues (id, title, category, year, description, file_url, file_name, file_size, cover_image, category_ids, sort_order) VALUES (
    'accessories-2026', 
    'Accessories Catalogue 2026', 
    'Accessories', 
    2026, 
    'Complete range of sports accessories including bags, bandages, hats, sports bags, and soccer balls.', 
    '/catalogues/QarniSports_Accessories_Catalogue_2026.pdf', 
    'QarniSports_Accessories_Catalogue_2026.pdf', 
    1071465, 
    '/category-heroes/accessories-catalogue.jpg.png', 
    '[\"accessories\", \"bags\", \"bandages\", \"hats\", \"sports-bags\", \"soccer-ball\"]', 
    4
)");

$pdo->exec("UPDATE catalogues SET title = 'Accessories Catalogue 2026' WHERE id = 'accessories-2026'");

echo "Database updated successfully!";
