<?php
$uri = $_GET['_url'] ?? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = strtok($uri, '?');

$scriptDir = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptDir !== '/' && !isset($_GET['_url']) && str_starts_with($uri, $scriptDir)) {
    $uri = substr($uri, strlen($scriptDir));
}

if (str_starts_with($uri, '/uploads/')) {
    $file = realpath(__DIR__ . $uri);
    $uploadRoot = realpath(__DIR__ . '/uploads');

    if ($file && $uploadRoot && str_starts_with($file, $uploadRoot) && is_file($file)) {
        $mime = mime_content_type($file) ?: 'application/octet-stream';
        header("Content-Type: $mime");
        header('Content-Length: ' . filesize($file));
        readfile($file);
        exit;
    }

    http_response_code(404);
    exit;
}

require_once __DIR__ . '/config/config.php';

header('Content-Type: application/json');
$corsOrigin = env('CORS_ORIGIN', '*');
header("Access-Control-Allow-Origin: $corsOrigin");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = rtrim($uri, '/');
$base = '/api';

$path = str_replace($base, '', $uri);
$path = '/' . trim($path, '/');
$segments = array_values(array_filter(explode('/', $path)));
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$sub = $segments[2] ?? null;

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$input = stripos($contentType, 'multipart/form-data') !== false
    ? $_POST
    : (json_decode(file_get_contents('php://input'), true) ?? []);

try {
    switch ($resource) {
        case 'auth':
            require __DIR__ . '/api/auth.php';
            break;
        case 'products':
            require __DIR__ . '/api/products.php';
            break;
        case 'categories':
            require __DIR__ . '/api/categories.php';
            break;
        case 'orders':
            require __DIR__ . '/api/orders.php';
            break;
        case 'customers':
            require __DIR__ . '/api/customers.php';
            break;
        case 'inventory':
            require __DIR__ . '/api/inventory.php';
            break;
        case 'reports':
            require __DIR__ . '/api/reports.php';
            break;
        case 'dashboard':
            require __DIR__ . '/api/dashboard.php';
            break;
        case 'settings':
            require __DIR__ . '/api/settings.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
