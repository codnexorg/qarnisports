<?php
require_once __DIR__ . '/lib.php';
$pdo = db();
$pdo->exec("DROP TABLE IF EXISTS catalogues");
echo "Catalogues table dropped successfully.\n";
