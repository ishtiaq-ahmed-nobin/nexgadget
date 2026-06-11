<?php
$db = getDB();

if ($method === 'GET') {
    requireAdmin();
    $stmt = $db->query("SELECT id, name, sku, stock, min_stock as minStock, price, (stock * price) as value FROM products ORDER BY name");
    $inventory = $stmt->fetchAll();
    echo json_encode([
        'inventory' => $inventory,
        'total' => count($inventory),
        'lowStock' => count(array_filter($inventory, fn($item) => (int)$item['stock'] <= (int)$item['minStock'])),
        'stockValue' => array_sum(array_map(fn($item) => (float)$item['value'], $inventory)),
    ]);
    exit;
}

if ($method === 'POST' && $id) {
    requireAdmin();
    $qty = $input['quantity'] ?? 0;
    $stmt = $db->prepare("UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute([max(0, $qty), $id]);
    echo json_encode(['message' => 'Stock updated']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Inventory endpoint not found']);
