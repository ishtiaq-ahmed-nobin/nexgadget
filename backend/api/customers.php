<?php
$db = getDB();

if ($method === 'GET') {
    requireAdmin();
    $search = $_GET['search'] ?? '';
    $where = $search ? "WHERE u.role = 'customer' AND (u.name LIKE ? OR u.email LIKE ?)" : "WHERE u.role = 'customer'";
    $params = $search ? ["%$search%", "%$search%"] : [];
    $stmt = $db->prepare("
        SELECT
            u.id,
            u.name,
            u.email,
            u.phone,
            u.created_at,
            COUNT(o.id) as orders,
            COALESCE(SUM(CASE WHEN o.status != 'Cancelled' THEN o.total ELSE 0 END), 0) as spent
        FROM users u
        LEFT JOIN orders o ON o.user_id = u.id
        $where
        GROUP BY u.id
        ORDER BY u.created_at DESC
    ");
    $stmt->execute($params);
    $customers = array_map(function ($customer) {
        return [
            ...$customer,
            'orders_count' => (int)$customer['orders'],
            'orders' => (int)$customer['orders'],
            'spent' => (float)$customer['spent'],
            'status' => 'Active',
            'joined' => substr($customer['created_at'], 0, 10),
        ];
    }, $stmt->fetchAll());
    echo json_encode(['customers' => $customers, 'total' => count($customers)]);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Customers endpoint not found']);
