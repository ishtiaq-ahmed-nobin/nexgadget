<?php
$db = getDB();

function normalizeProductInput(array $input): array {
    $input['category_name'] = $input['category_name'] ?? ($input['category'] ?? '');

    foreach (['price', 'discount_price', 'rating'] as $field) {
        if (array_key_exists($field, $input)) {
            $input[$field] = $input[$field] === '' ? null : (float)$input[$field];
        }
    }

    foreach (['stock', 'review_count', 'featured', 'is_new'] as $field) {
        if (array_key_exists($field, $input)) {
            $input[$field] = $input[$field] === '' ? 0 : (int)$input[$field];
        }
    }

    return $input;
}

function saveProductImage(): ?string {
    if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $uploadDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0775, true);
    }

    $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($ext, $allowed, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid image type']);
        exit;
    }

    $filename = uniqid('prod_', true) . '.' . $ext;
    if (!move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . '/' . $filename)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save image file']);
        exit;
    }

    return appUrl("uploads/$filename");
}

function productImageUrl(string $image): string {
    if ($image === '' || preg_match('/^https?:\/\//i', $image)) {
        return $image;
    }

    if (str_starts_with($image, '/uploads/')) {
        return appUrl(ltrim($image, '/'));
    }

    return $image;
}

function normalizeProductRow(array $product): array {
    $product['image'] = productImageUrl($product['image'] ?? '');
    return $product;
}

if ($method === 'GET' && !$id) {
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $minPrice = $_GET['minPrice'] ?? '';
    $maxPrice = $_GET['maxPrice'] ?? '';
    $sort = $_GET['sort'] ?? 'newest';
    $page = max(1, (int)($_GET['page'] ?? 1));
    $perPage = min(100, max(1, (int)($_GET['per_page'] ?? $_GET['perPage'] ?? 12)));

    $where = [];
    $params = [];

    if ($search) {
        $where[] = "(name LIKE ? OR description LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    if ($category) {
        $catStmt = $db->prepare("SELECT name FROM categories WHERE LOWER(slug) = LOWER(?)");
        $catStmt->execute([$category]);
        $catName = $catStmt->fetchColumn();
        if ($catName) {
            $where[] = "(LOWER(category) = ? OR LOWER(category_name) = ?)";
            $params[] = strtolower($catName);
            $params[] = strtolower($catName);
        }
    }
    if ($minPrice !== '') {
        $where[] = "price >= ?";
        $params[] = (float)$minPrice;
    }
    if ($maxPrice !== '') {
        $where[] = "price <= ?";
        $params[] = (float)$maxPrice;
    }

    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $orderMap = [
        'price_asc' => 'ORDER BY price ASC',
        'price_desc' => 'ORDER BY price DESC',
        'popular' => 'ORDER BY review_count DESC',
        'discount' => 'ORDER BY COALESCE(discount_price, price) ASC',
        'newest' => 'ORDER BY created_at DESC',
    ];
    $orderClause = $orderMap[$sort] ?? 'ORDER BY created_at DESC';

    $countStmt = $db->prepare("SELECT COUNT(*) FROM products $whereClause");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();
    $totalPages = max(1, ceil($total / $perPage));
    $offset = ($page - 1) * $perPage;

    $stmt = $db->prepare("SELECT * FROM products $whereClause $orderClause LIMIT ? OFFSET ?");
    $stmt->execute([...$params, $perPage, $offset]);
    $products = array_map('normalizeProductRow', $stmt->fetchAll());

    echo json_encode([
        'products' => $products,
        'totalPages' => $totalPages,
        'currentPage' => $page,
        'total' => $total,
    ]);
    exit;
}

if ($method === 'GET' && $id) {
    $stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();
    if (!$product) {
        http_response_code(404);
        echo json_encode(['error' => 'Product not found']);
        exit;
    }
    if ($product['gallery']) {
        $product['gallery'] = json_decode($product['gallery'], true);
    }
    $product = normalizeProductRow($product);
    echo json_encode($product);
    exit;
}

if ($method === 'POST' && !$id) {
    requireAdmin();
    $input = normalizeProductInput($input);
    $name = $input['name'] ?? '';
    if (!$name) {
        http_response_code(400);
        echo json_encode(['error' => 'Product name required']);
        exit;
    }

    $image = saveProductImage() ?? ($input['image'] ?? '');

    $stmt = $db->prepare("INSERT INTO products (name, category, category_name, price, discount_price, image, description, short_description, stock, rating, review_count, featured, is_new, status, sku) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $name,
        $input['category'] ?? '',
        $input['category_name'] ?? '',
        $input['price'] ?? 0,
        $input['discount_price'] ?? null,
        $image,
        $input['description'] ?? '',
        $input['short_description'] ?? '',
        $input['stock'] ?? 0,
        $input['rating'] ?? 4.5,
        $input['review_count'] ?? 0,
        $input['featured'] ?? 0,
        $input['is_new'] ?? 0,
        $input['status'] ?? 'Active',
        $input['sku'] ?? '',
    ]);

    echo json_encode(['id' => $db->lastInsertId(), 'message' => 'Product created']);
    exit;
}

if (($method === 'PUT' || $method === 'POST') && $id) {
    requireAdmin();
    $input = normalizeProductInput($input);
    $fields = [];
    $params = [];
    foreach (['name', 'category', 'category_name', 'price', 'discount_price', 'description', 'short_description', 'stock', 'rating', 'review_count', 'featured', 'is_new', 'status', 'sku'] as $f) {
        if (isset($input[$f])) {
            $fields[] = "$f = ?";
            $params[] = $input[$f];
        }
    }
    $image = saveProductImage();
    if ($image) {
        $fields[] = "image = ?";
        $params[] = $image;
    }
    if (!$fields) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        exit;
    }
    $params[] = $id;
    $stmt = $db->prepare("UPDATE products SET " . implode(', ', $fields) . ", updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->execute($params);
    echo json_encode(['message' => 'Product updated']);
    exit;
}

if ($method === 'DELETE' && $id) {
    requireAdmin();
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(['message' => 'Product deleted']);
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Products endpoint not found']);
