<?php
require_once __DIR__ . '/config.php';

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $host = env('DB_HOST', 'sql110.infinityfree.com');
        $port = env('DB_PORT', '3306');
        $name = env('DB_NAME', 'if0_42128371_nexgadget');
        $user = env('DB_USER', 'if0_42128371');
        $pass = env('DB_PASS', 'TNHePiqe5utlQR1');

        $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
    return $pdo;
}

