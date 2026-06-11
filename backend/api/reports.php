<?php
$db = getDB();

if ($method === 'GET' && $id) {
    requireAdmin();
    $range = $_GET['range'] ?? '30d';

    if ($id === 'revenue') {
        $stmt = $db->query("SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count FROM orders WHERE status != 'Cancelled'");
        $data = $stmt->fetch();
        $stmt = $db->query("SELECT date(created_at) as date, SUM(total) as revenue FROM orders WHERE status != 'Cancelled' GROUP BY date(created_at) ORDER BY date DESC LIMIT 30");
        echo json_encode(['total' => $data['total'], 'count' => $data['count'], 'trend' => $stmt->fetchAll()]);
        exit;
    }

    if ($id === 'products') {
        $stmt = $db->query("SELECT category, COUNT(*) as count FROM products GROUP BY category");
        echo json_encode($stmt->fetchAll());
        exit;
    }

    if ($id === 'orders') {
        $stmt = $db->query("SELECT status, COUNT(*) as count FROM orders GROUP BY status");
        echo json_encode($stmt->fetchAll());
        exit;
    }
}

http_response_code(404);
echo json_encode(['error' => 'Reports endpoint not found']);
