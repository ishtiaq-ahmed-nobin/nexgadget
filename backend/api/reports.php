<?php
$db = getDB();

if ($method === 'GET' && $id) {
    requireAdmin();
    $from = $_GET['from'] ?? null;
    $to = $_GET['to'] ?? null;
    $dateWhere = [];
    $dateParams = [];

    if ($from && preg_match('/^\d{4}-\d{2}-\d{2}$/', $from)) {
        $dateWhere[] = 'created_at >= ?';
        $dateParams[] = $from . ' 00:00:00';
    }

    if ($to && preg_match('/^\d{4}-\d{2}-\d{2}$/', $to)) {
        $dateWhere[] = 'created_at <= ?';
        $dateParams[] = $to . ' 23:59:59';
    }

    $dateSql = $dateWhere ? ' AND ' . implode(' AND ', $dateWhere) : '';

    if ($id === 'revenue') {
        $stmt = $db->prepare("SELECT COALESCE(SUM(total), 0) as total, COUNT(*) as count FROM orders WHERE status != 'Cancelled'$dateSql");
        $stmt->execute($dateParams);
        $data = $stmt->fetch();
        $stmt = $db->prepare("SELECT date(created_at) as date, SUM(total) as revenue FROM orders WHERE status != 'Cancelled'$dateSql GROUP BY date(created_at) ORDER BY date DESC");
        $stmt->execute($dateParams);
        echo json_encode(['total' => $data['total'], 'count' => $data['count'], 'trend' => $stmt->fetchAll()]);
        exit;
    }

    if ($id === 'products') {
        $stmt = $db->query("SELECT category, COUNT(*) as count FROM products GROUP BY category");
        echo json_encode($stmt->fetchAll());
        exit;
    }

    if ($id === 'orders') {
        $where = $dateWhere ? 'WHERE ' . implode(' AND ', $dateWhere) : '';
        $stmt = $db->prepare("SELECT status, COUNT(*) as count FROM orders $where GROUP BY status");
        $stmt->execute($dateParams);
        echo json_encode($stmt->fetchAll());
        exit;
    }
}

http_response_code(404);
echo json_encode(['error' => 'Reports endpoint not found']);
