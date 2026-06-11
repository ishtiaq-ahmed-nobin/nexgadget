<?php
$db = getDB();

if ($method === 'POST' && $id === 'login') {
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit;
    }

    $token = generateToken($user['id'], $user['role']);
    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ],
    ]);
    exit;
}

if ($method === 'POST' && $id === 'register') {
    $name = $input['name'] ?? '';
    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (!$name || !$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'All fields required']);
        exit;
    }

    $check = $db->prepare("SELECT id FROM users WHERE email = ?");
    $check->execute([$email]);
    if ($check->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email already registered']);
        exit;
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'customer')");
    $stmt->execute([$name, $email, $hash]);
    $userId = $db->lastInsertId();

    $token = generateToken($userId, 'customer');
    echo json_encode([
        'token' => $token,
        'user' => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'customer'],
    ]);
    exit;
}

if ($method === 'POST' && $id === 'google') {
    echo json_encode(['error' => 'Google login not configured']);
    exit;
}

if ($method === 'POST' && $id === 'forgot-password') {
    echo json_encode(['message' => 'If email exists, a reset link will be sent']);
    exit;
}

if ($method === 'POST' && $id === 'verify-otp') {
    echo json_encode(['message' => 'OTP verified']);
    exit;
}

if ($method === 'POST' && $id === 'reset-password') {
    echo json_encode(['message' => 'Password reset successful']);
    exit;
}

if ($method === 'GET' && $id === 'me') {
    $user = requireAuth();
    $stmt = $db->prepare("SELECT id, name, email, role, phone FROM users WHERE id = ?");
    $stmt->execute([$user['user_id']]);
    echo json_encode($stmt->fetch());
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Auth endpoint not found']);
