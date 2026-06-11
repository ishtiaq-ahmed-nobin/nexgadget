<?php

function loadEnv(string $path): void {
    if (!file_exists($path) || !function_exists('putenv')) return;
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        if (str_contains($line, '=')) {
            [$key, $value] = explode('=', $line, 2);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

loadEnv(__DIR__ . '/../.env');

function env(string $key, mixed $default = null): mixed {
    $val = getenv($key);
    if ($val === false || $val === '') return $default;
    $lower = strtolower($val);
    if ($lower === 'true') return true;
    if ($lower === 'false') return false;
    if ($lower === 'null') return null;
    return $val;
}

function appUrl(string $path = ''): string {
    $base = env('APP_URL');
    if (!$base) {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $scriptDir = dirname($_SERVER['SCRIPT_NAME'] ?? '/');
        $base = "$scheme://$host" . rtrim($scriptDir, '/');
    }
    return rtrim($base, '/') . '/' . ltrim($path, '/');
}
