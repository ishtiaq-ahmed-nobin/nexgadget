<?php
$db = getDB();

if ($method === 'POST') {
    $orderId = 'ORD-' . str_pad(random_int(1, 99999), 5, '0', STR_PAD_LEFT);
    $stmt = $db->prepare("INSERT INTO orders (id, user_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping, tax, total, status, payment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $orderId,
        $input['user_id'] ?? null,
        $input['customer_name'] ?? '',
        $input['customer_email'] ?? '',
        $input['customer_phone'] ?? '',
        $input['shipping_address'] ?? '',
        json_encode($input['items'] ?? []),
        $input['subtotal'] ?? 0,
        $input['shipping'] ?? 0,
        $input['tax'] ?? 0,
        $input['total'] ?? 0,
        'Pending',
        'Pending',
    ]);
    echo json_encode(['id' => $orderId, 'message' => 'Order created']);
    exit;
}

if ($method === 'GET' && $id === 'my') {
    $authUser = requireAuth();
    $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$authUser['user_id']]);
    $rows = $stmt->fetchAll();
    $orders = array_map(function ($order) {
        $items = json_decode($order['items'] ?? '[]', true) ?: [];
        return [
            ...$order,
            'customer' => $order['customer_name'],
            'email' => $order['customer_email'],
            'items_raw' => $order['items'],
            'items_count' => count($items),
            'items' => $items,
            'date' => substr($order['created_at'], 0, 10),
        ];
    }, $rows);
    echo json_encode(['orders' => $orders, 'total' => count($orders)]);
    exit;
}

if ($method === 'GET') {
    requireAdmin();
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    $where = [];
    $params = [];
    if ($status) {
        $where[] = "status = ?";
        $params[] = $status;
    }
    if ($search) {
        $where[] = "(customer_name LIKE ? OR customer_email LIKE ? OR id LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $stmt = $db->prepare("SELECT * FROM orders $whereClause ORDER BY created_at DESC");
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    $orders = array_map(function ($order) {
        $items = json_decode($order['items'] ?? '[]', true) ?: [];
        return [
            ...$order,
            'customer' => $order['customer_name'],
            'email' => $order['customer_email'],
            'items_raw' => $order['items'],
            'items_count' => count($items),
            'items' => count($items),
            'date' => substr($order['created_at'], 0, 10),
        ];
    }, $rows);
    echo json_encode(['orders' => $orders, 'total' => count($orders)]);
    exit;
}

if ($method === 'PUT' && $id && $sub === 'status') {
    requireAdmin();
    $status = $input['status'] ?? '';
    if ($status) {
        $stmt = $db->prepare("UPDATE orders SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }
    echo json_encode(['message' => 'Order status updated']);
    exit;
}

if ($method === 'PUT' && $id && $sub === 'payment') {
    requireAdmin();
    $payment = $input['payment'] ?? '';
    if ($payment) {
        $stmt = $db->prepare("UPDATE orders SET payment = ? WHERE id = ?");
        $stmt->execute([$payment, $id]);
    }
    echo json_encode(['message' => 'Order payment updated']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Orders endpoint not found']);
