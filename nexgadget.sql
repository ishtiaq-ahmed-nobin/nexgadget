-- NexGadget Database Schema for MySQL
-- Generated from SQLite seed data



-- -----------------------------------------------------------
-- Users
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer',
    phone VARCHAR(50) DEFAULT '',
    avatar VARCHAR(500) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO users (name, email, password, role) VALUES
    ('Admin', 'admin@nexgadget.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin');

INSERT IGNORE INTO users (name, email, password, role, phone, created_at) VALUES
    ('Sarah Johnson',   'sarah@example.com',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+8801711000001', DATE_SUB(NOW(), INTERVAL 42 DAY)),
    ('Michael Chen',    'michael@example.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+8801711000002', DATE_SUB(NOW(), INTERVAL 35 DAY)),
    ('Emily Rodriguez', 'emily@example.com',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+8801711000003', DATE_SUB(NOW(), INTERVAL 28 DAY)),
    ('David Kim',       'david@example.com',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+8801711000004', DATE_SUB(NOW(), INTERVAL 21 DAY)),
    ('Ayesha Rahman',   'ayesha@example.com',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+8801711000005', DATE_SUB(NOW(), INTERVAL 14 DAY)),
    ('Tanvir Hasan',    'tanvir@example.com',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', '+8801711000006', DATE_SUB(NOW(), INTERVAL 7 DAY));

-- -----------------------------------------------------------
-- Categories
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT '📦',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (name, slug, icon) VALUES
    ('Smartphones',         'smartphones',      '📱'),
    ('Laptops',             'laptops',          '💻'),
    ('Tablets',             'tablets',          '📲'),
    ('Smart Watches',       'smart-watches',    '⌚'),
    ('Headphones',          'headphones',       '🎧'),
    ('Gaming Accessories',  'gaming',           '🎮'),
    ('Computer Components', 'components',       '🖥️'),
    ('Cameras',             'cameras',          '📷'),
    ('Networking Devices',  'networking',       '🌐'),
    ('Smart Home Devices',  'smart-home',       '🏠');

-- -----------------------------------------------------------
-- Products
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    category_name VARCHAR(255) DEFAULT '',
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) DEFAULT NULL,
    image VARCHAR(500) DEFAULT '',
    gallery JSON DEFAULT NULL,
    rating DECIMAL(3,1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    stock INT DEFAULT 0,
    min_stock INT DEFAULT 5,
    featured TINYINT(1) DEFAULT 0,
    is_new TINYINT(1) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Active',
    description TEXT DEFAULT NULL,
    short_description TEXT DEFAULT NULL,
    sku VARCHAR(100) DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO products (name, category, category_name, price, discount_price, image, stock, featured, status, rating, review_count, short_description, description, sku) VALUES
    ('Galaxy S25 Ultra',               'Smartphones',        'Smartphones',        1299.00, 1099.00, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop', 45, 1, 'Active', 4.7, 100, 'Flagship smartphone with 200MP camera and S Pen',             'Flagship smartphone with 200MP camera and S Pen',             'NG-0001'),
    ('iPhone 16 Pro Max',              'Smartphones',        'Smartphones',        1499.00, 1349.00, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 38, 1, 'Active', 4.7, 100, 'Premium iPhone with A18 Pro chip and titanium design',         'Premium iPhone with A18 Pro chip and titanium design',         'NG-0002'),
    ('MacBook Pro 16" M4',             'Laptops',            'Laptops',            2499.00, 2299.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop', 22, 1, 'Active', 4.7, 100, 'M4-powered laptop with 22hr battery life',                     'M4-powered laptop with 22hr battery life',                     'NG-0003'),
    ('ThinkPad X1 Carbon Gen 12',      'Laptops',            'Laptops',            1899.00, NULL,    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop', 15, 0, 'Active', 4.7, 100, 'Ultralight business laptop with OLED display',                 'Ultralight business laptop with OLED display',                 'NG-0004'),
    ('iPad Air M3',                    'Tablets',            'Tablets',             799.00,  699.00, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop', 30, 1, 'Active', 4.7, 100, 'M3-powered tablet with 13-inch display',                       'M3-powered tablet with 13-inch display',                       'NG-0005'),
    ('Apple Watch Ultra 3',            'Smart Watches',      'Smart Watches',       899.00,  799.00, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop', 28, 1, 'Active', 4.7, 100, 'Rugged smartwatch with 86-hour battery',                       'Rugged smartwatch with 86-hour battery',                       'NG-0006'),
    ('Sony WH-1000XM6',                'Headphones',         'Headphones',          399.00,  349.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', 55, 1, 'Active', 4.7, 100, 'Best-in-class noise cancelling headphones',                     'Best-in-class noise cancelling headphones',                     'NG-0007'),
    ('PlayStation 6 Bundle',           'Gaming Accessories', 'Gaming Accessories',  699.00,  649.00, 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',  8, 1, 'Active', 4.7, 100, 'Next-gen console with 2TB SSD + controller',                   'Next-gen console with 2TB SSD + controller',                   'NG-0008'),
    ('Samsung 990 EVO Plus 2TB',       'Computer Components','Computer Components', 179.00,  149.00, 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop', 62, 0, 'Active', 4.7, 100, 'NVMe SSD with 7,450 MB/s read speed',                          'NVMe SSD with 7,450 MB/s read speed',                          'NG-0009'),
    ('Sony Alpha A7 V',                'Cameras',            'Cameras',            3499.00, NULL,    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop',  5, 0, 'Active', 4.7, 100, 'Full-frame 61MP mirrorless camera with 8K video',              'Full-frame 61MP mirrorless camera with 8K video',              'NG-0010'),
    ('TP-Link Deco AXE5400',           'Networking Devices', 'Networking Devices',   299.00, NULL,    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop', 20, 0, 'Active', 4.7, 100, 'Wi-Fi 6E mesh system for whole-home coverage',                 'Wi-Fi 6E mesh system for whole-home coverage',                 'NG-0011'),
    ('Amazon Echo Studio 2',           'Smart Home Devices', 'Smart Home Devices',   199.00,  169.00, 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=400&fit=crop', 40, 1, 'Active', 4.7, 100, 'Premium smart speaker with Dolby Atmos',                       'Premium smart speaker with Dolby Atmos',                       'NG-0012');

-- -----------------------------------------------------------
-- Orders
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(20) PRIMARY KEY,
    user_id INT DEFAULT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) DEFAULT '',
    shipping_address TEXT DEFAULT NULL,
    items JSON NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    payment VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO orders (id, user_id, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping, tax, total, status, payment, created_at) VALUES
    ('ORD-10001', 2, 'Sarah Johnson',   'sarah@example.com',    '+8801711000001', 'Banani, Dhaka',      '[{"name":"Galaxy S25 Ultra","quantity":1,"price":1099}]',                                                                                          1099.00, 0,     87.92,  1186.92, 'Completed',  'Paid',    DATE_SUB(NOW(), INTERVAL 12 DAY)),
    ('ORD-10002', 3, 'Michael Chen',    'michael@example.com',  '+8801711000002', 'Gulshan, Dhaka',     '[{"name":"MacBook Pro 16\\\" M4","quantity":1,"price":2299}]',                                                                                     2299.00, 0,     183.92, 2482.92, 'Processing', 'Paid',    DATE_SUB(NOW(), INTERVAL 10 DAY)),
    ('ORD-10003', 4, 'Emily Rodriguez', 'emily@example.com',    '+8801711000003', 'Dhanmondi, Dhaka',   '[{"name":"Sony WH-1000XM6","quantity":1,"price":349},{"name":"iPad Air M3","quantity":1,"price":699}]',                                          1048.00, 0,     83.84,  1131.84, 'Shipped',    'Paid',    DATE_SUB(NOW(), INTERVAL 8 DAY)),
    ('ORD-10004', 5, 'David Kim',       'david@example.com',    '+8801711000004', 'Uttara, Dhaka',      '[{"name":"PlayStation 6 Bundle","quantity":1,"price":649}]',                                                                                        649.00,  5.99,  52.40,  707.39,  'Pending',    'Pending', DATE_SUB(NOW(), INTERVAL 6 DAY)),
    ('ORD-10005', 6, 'Ayesha Rahman',   'ayesha@example.com',   '+8801711000005', 'Mirpur, Dhaka',      '[{"name":"Amazon Echo Studio 2","quantity":1,"price":169}]',                                                                                        169.00,  5.99,  14.00,  188.99,  'Completed',  'Paid',    DATE_SUB(NOW(), INTERVAL 4 DAY)),
    ('ORD-10006', 7, 'Tanvir Hasan',    'tanvir@example.com',   '+8801711000006', 'Mohammadpur, Dhaka', '[{"name":"Samsung 990 EVO Plus 2TB","quantity":1,"price":149}]',                                                                                    149.00,  5.99,  12.40,  167.39,  'Cancelled',  'Refunded',DATE_SUB(NOW(), INTERVAL 2 DAY)),
    ('ORD-10007', 2, 'Sarah Johnson',   'sarah@example.com',    '+8801711000001', 'Banani, Dhaka',      '[{"name":"Apple Watch Ultra 3","quantity":1,"price":799}]',                                                                                         799.00,  0,     63.92,  862.92,  'Completed',  'Paid',    DATE_SUB(NOW(), INTERVAL 1 DAY));

-- -----------------------------------------------------------
-- Settings
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    `key` VARCHAR(255) NOT NULL UNIQUE,
    `value` TEXT NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO settings (`key`, `value`) VALUES
    ('store_name', 'NexGadget'),
    ('store_email', 'support@nexgadget.com'),
    ('store_phone', '+880-1234-567890'),
    ('store_address', 'Dhaka, Bangladesh'),
    ('currency', '৳'),
    ('tax_rate', '8'),
    ('free_shipping_min', '50'),
    ('shipping_fee', '5.99'),
    ('site_name', 'NexGadget'),
    ('site_email', 'support@nexgadget.com'),
    ('site_phone', '+880-1234-567890'),
    ('address', 'Dhaka, Bangladesh'),
    ('currency', 'BDT'),
    ('tax_rate', '8'),
    ('shipping_fee', '5.99'),
    ('free_shipping_threshold', '50'),
    ('bkash', '1'),
    ('nagad', '1'),
    ('sslcommerz', '1'),
    ('visa', '1'),
    ('mastercard', '1'),
    ('amex', '1'),
    ('live_mode', '0'),
    ('smtp_host', 'smtp.example.com'),
    ('smtp_port', '587'),
    ('smtp_user', 'noreply@nexgadget.com'),
    ('smtp_pass', ''),
    ('from_name', 'NexGadget'),
    ('from_email', 'noreply@nexgadget.com');
