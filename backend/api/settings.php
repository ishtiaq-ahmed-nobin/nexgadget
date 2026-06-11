<?php
$db = getDB();

if ($method === 'GET') {
    $stmt = $db->query("SELECT `key`, `value` FROM settings");
    $rows = $stmt->fetchAll();
    $settings = [];
    foreach ($rows as $row) {
        $settings[$row['key']] = $row['value'];
    }
    echo json_encode(['settings' => $rows, ...$settings]);
    exit;
}

if ($method === 'PUT') {
    requireAdmin();
    $settings = $input['settings'] ?? $input;
    foreach ($settings as $key => $value) {
        if (is_bool($value)) {
            $value = $value ? '1' : '0';
        }
        $stmt = $db->prepare("INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
        $stmt->execute([$key, $value]);
    }
    echo json_encode(['message' => 'Settings updated']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Settings endpoint not found']);
