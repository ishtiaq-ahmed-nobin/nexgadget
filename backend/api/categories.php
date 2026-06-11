<?php
$db = getDB();

if ($method === 'GET') {
    $stmt = $db->query("SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category = c.name OR p.category_name = c.name) as product_count FROM categories c ORDER BY c.name");
    $categories = $stmt->fetchAll();
    echo json_encode(['categories' => $categories, 'total' => count($categories)]);
    exit;
}

if ($method === 'POST') {
    requireAdmin();
    $name = $input['name'] ?? '';
    $slug = $input['slug'] ?? strtolower(str_replace(' ', '-', $name));
    $icon = $input['icon'] ?? '📦';
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Category name required']);
        exit;
    }
    $stmt = $db->prepare("INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)");
    $stmt->execute([$name, $slug, $icon]);
    echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Category created']);
    exit;
}

if ($method === 'PUT' && $id) {
    requireAdmin();
    $name = $input['name'] ?? '';
    $slug = $input['slug'] ?? '';
    $icon = $input['icon'] ?? '';
    $fields = [];
    $params = [];
    if ($name) { $fields[] = "name = ?"; $params[] = $name; }
    if ($slug) { $fields[] = "slug = ?"; $params[] = $slug; }
    if ($icon) { $fields[] = "icon = ?"; $params[] = $icon; }
    if (!$fields) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit;
    }
    $params[] = $id;
    $stmt = $db->prepare("UPDATE categories SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);
    echo json_encode(['message' => 'Category updated']);
    exit;
}

if ($method === 'DELETE' && $id) {
    requireAdmin();
    $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Category deleted']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Categories endpoint not found']);
