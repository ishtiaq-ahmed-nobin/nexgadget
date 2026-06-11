<?php
require_once __DIR__ . '/config/database.php';

echo "Running migrations...\n";

$db = getDB();
$sql = file_get_contents(__DIR__ . '/migrations/init.sql');

// Execute multi-statement SQL
foreach (explode(';', $sql) as $statement) {
    $statement = trim($statement);
    if ($statement !== '') {
        $db->exec($statement);
    }
}

$categoryCount = (int)$db->query("SELECT COUNT(*) FROM categories")->fetchColumn();
if ($categoryCount === 0) {
    $categories = [
        ['Smartphones', 'smartphones', '📱'],
        ['Laptops', 'laptops', '💻'],
        ['Tablets', 'tablets', '📲'],
        ['Smart Watches', 'smart-watches', '⌚'],
        ['Headphones', 'headphones', '🎧'],
        ['Gaming Accessories', 'gaming', '🎮'],
        ['Computer Components', 'components', '🖥️'],
        ['Cameras', 'cameras', '📷'],
        ['Networking Devices', 'networking', '🌐'],
        ['Smart Home Devices', 'smart-home', '🏠'],
    ];
    $stmt = $db->prepare("INSERT IGNORE INTO categories (name, slug, icon) VALUES (?, ?, ?)");
    foreach ($categories as $category) {
        $stmt->execute($category);
    }
}

$productCount = (int)$db->query("SELECT COUNT(*) FROM products")->fetchColumn();
if ($productCount === 0) {
    $products = [
        ['Galaxy S25 Ultra', 'Smartphones', 1299, 1099, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', 45, 1, 'Flagship smartphone with 200MP camera and S Pen'],
        ['iPhone 16 Pro Max', 'Smartphones', 1499, 1349, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 38, 1, 'Premium iPhone with A18 Pro chip and titanium design'],
        ['MacBook Pro 16" M4', 'Laptops', 2499, 2299, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 22, 1, 'M4-powered laptop with 22hr battery life'],
        ['ThinkPad X1 Carbon Gen 12', 'Laptops', 1899, null, 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop', 15, 0, 'Ultralight business laptop with OLED display'],
        ['iPad Air M3', 'Tablets', 799, 699, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', 30, 1, 'M3-powered tablet with 13-inch display'],
        ['Apple Watch Ultra 3', 'Smart Watches', 899, 799, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop', 28, 1, 'Rugged smartwatch with 86-hour battery'],
        ['Sony WH-1000XM6', 'Headphones', 399, 349, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 55, 1, 'Best-in-class noise cancelling headphones'],
        ['PlayStation 6 Bundle', 'Gaming Accessories', 699, 649, 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop', 8, 1, 'Next-gen console with 2TB SSD + controller'],
        ['Samsung 990 EVO Plus 2TB', 'Computer Components', 179, 149, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop', 62, 0, 'NVMe SSD with 7,450 MB/s read speed'],
        ['Sony Alpha A7 V', 'Cameras', 3499, null, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', 5, 0, 'Full-frame 61MP mirrorless camera with 8K video'],
        ['TP-Link Deco AXE5400', 'Networking Devices', 299, null, 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop', 20, 0, 'Wi-Fi 6E mesh system for whole-home coverage'],
        ['Amazon Echo Studio 2', 'Smart Home Devices', 199, 169, 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop', 40, 1, 'Premium smart speaker with Dolby Atmos'],
    ];
    $stmt = $db->prepare("INSERT IGNORE INTO products (name, category, category_name, price, discount_price, image, stock, featured, status, rating, review_count, short_description, description, sku) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Active', 4.7, 100, ?, ?, ?)");
    foreach ($products as $index => $product) {
        [$name, $category, $price, $discountPrice, $image, $stock, $featured, $shortDescription] = $product;
        $stmt->execute([$name, $category, $category, $price, $discountPrice, $image, $stock, $featured, $shortDescription, $shortDescription, 'NG-' . str_pad((string)($index + 1), 4, '0', STR_PAD_LEFT)]);
    }
}

$settingDefaults = [
    'site_name' => 'NexGadget',
    'site_email' => 'support@nexgadget.com',
    'site_phone' => '+880-1234-567890',
    'address' => 'Dhaka, Bangladesh',
    'currency' => 'BDT',
    'tax_rate' => '8',
    'shipping_fee' => '5.99',
    'free_shipping_threshold' => '50',
    'bkash' => '1',
    'nagad' => '1',
    'sslcommerz' => '1',
    'visa' => '1',
    'mastercard' => '1',
    'amex' => '1',
    'live_mode' => '0',
    'smtp_host' => 'smtp.example.com',
    'smtp_port' => '587',
    'smtp_user' => 'noreply@nexgadget.com',
    'smtp_pass' => '',
    'from_name' => 'NexGadget',
    'from_email' => 'noreply@nexgadget.com',
];
$stmt = $db->prepare("INSERT IGNORE INTO settings (`key`, `value`) VALUES (?, ?)");
foreach ($settingDefaults as $key => $value) {
    $stmt->execute([$key, $value]);
}

$customerCount = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'customer'")->fetchColumn();
if ($customerCount === 0) {
    $customers = [
        ['Sarah Johnson', 'sarah@example.com', '+8801711000001', 42],
        ['Michael Chen', 'michael@example.com', '+8801711000002', 35],
        ['Emily Rodriguez', 'emily@example.com', '+8801711000003', 28],
        ['David Kim', 'david@example.com', '+8801711000004', 21],
        ['Ayesha Rahman', 'ayesha@example.com', '+8801711000005', 14],
        ['Tanvir Hasan', 'tanvir@example.com', '+8801711000006', 7],
    ];
    $hash = password_hash('password', PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT IGNORE INTO users (name, email, password, role, phone, created_at) VALUES (?, ?, ?, 'customer', ?, DATE_SUB(NOW(), INTERVAL ? DAY))");
    foreach ($customers as $customer) {
        [$name, $email, $phone, $days] = $customer;
        $stmt->execute([$name, $email, $hash, $phone, $days]);
    }
}

$orderCount = (int)$db->query("SELECT COUNT(*) FROM orders")->fetchColumn();
if ($orderCount === 0) {
    $customerIds = [];
    $stmt = $db->query("SELECT id, email, name FROM users WHERE role = 'customer'");
    foreach ($stmt->fetchAll() as $customer) {
        $customerIds[$customer['email']] = $customer;
    }

    $orders = [
        ['ORD-10001', 'sarah@example.com', 'Sarah Johnson', 'sarah@example.com', '+8801711000001', 'Banani, Dhaka', 'Completed', 'Paid', 1099, 12, [['name' => 'Galaxy S25 Ultra', 'quantity' => 1, 'price' => 1099]]],
        ['ORD-10002', 'michael@example.com', 'Michael Chen', 'michael@example.com', '+8801711000002', 'Gulshan, Dhaka', 'Processing', 'Paid', 2299, 10, [['name' => 'MacBook Pro 16" M4', 'quantity' => 1, 'price' => 2299]]],
        ['ORD-10003', 'emily@example.com', 'Emily Rodriguez', 'emily@example.com', '+8801711000003', 'Dhanmondi, Dhaka', 'Shipped', 'Paid', 1048, 8, [['name' => 'Sony WH-1000XM6', 'quantity' => 1, 'price' => 349], ['name' => 'iPad Air M3', 'quantity' => 1, 'price' => 699]]],
        ['ORD-10004', 'david@example.com', 'David Kim', 'david@example.com', '+8801711000004', 'Uttara, Dhaka', 'Pending', 'Pending', 649, 6, [['name' => 'PlayStation 6 Bundle', 'quantity' => 1, 'price' => 649]]],
        ['ORD-10005', 'ayesha@example.com', 'Ayesha Rahman', 'ayesha@example.com', '+8801711000005', 'Mirpur, Dhaka', 'Completed', 'Paid', 169, 4, [['name' => 'Amazon Echo Studio 2', 'quantity' => 1, 'price' => 169]]],
        ['ORD-10006', 'tanvir@example.com', 'Tanvir Hasan', 'tanvir@example.com', '+8801711000006', 'Mohammadpur, Dhaka', 'Cancelled', 'Refunded', 149, 2, [['name' => 'Samsung 990 EVO Plus 2TB', 'quantity' => 1, 'price' => 149]]],
        ['ORD-10007', 'sarah@example.com', 'Sarah Johnson', 'sarah@example.com', '+8801711000001', 'Banani, Dhaka', 'Completed', 'Paid', 799, 1, [['name' => 'Apple Watch Ultra 3', 'quantity' => 1, 'price' => 799]]],
    ];

    $stmt = $db->prepare("INSERT IGNORE INTO orders (id, user_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping, tax, total, status, payment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL ? DAY))");
    foreach ($orders as $order) {
        [$id, $email, $name, $customerEmail, $phone, $address, $status, $payment, $subtotal, $days, $items] = $order;
        $shipping = $subtotal >= 50 ? 0 : 5.99;
        $tax = round($subtotal * 0.08, 2);
        $total = round($subtotal + $shipping + $tax, 2);
        $stmt->execute([$id, $customerIds[$email]['id'] ?? null, $name, $customerEmail, $phone, $address, json_encode($items), $subtotal, $shipping, $tax, $total, $status, $payment, $days]);
    }
}

echo "Database migrated successfully.\n";
echo "Default admin: admin@nexgadget.com / password\n";
