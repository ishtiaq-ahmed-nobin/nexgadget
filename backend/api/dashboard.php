<?php
$db = getDB();

if ($method === 'GET' && $id === 'stats') {
    requireAdmin();
    $revenue = $db->query("SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'Cancelled'")->fetchColumn();
    $products = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
    $orders = $db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
    $customers = $db->query("SELECT COUNT(*) FROM users WHERE role = 'customer'")->fetchColumn();
    echo json_encode([
        'revenue' => $revenue,
        'products' => $products,
        'orders' => $orders,
        'customers' => $customers,
    ]);
    exit;
}

if ($method === 'GET' && $id === 'charts') {
    requireAdmin();
    $recentOrders = $db->query("SELECT id, customer_name as customer, total as amount, status, created_at as date FROM orders ORDER BY created_at DESC LIMIT 5")->fetchAll();
    echo json_encode(['recentOrders' => $recentOrders]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Dashboard endpoint not found']);
