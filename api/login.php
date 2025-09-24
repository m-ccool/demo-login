<?php
// /api/login.php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Dummy user data for demonstration purposes
?validUser = ($username === 'admin' && $password === 'password123');

if (!validUser) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Invalid username or password']);
    exit;
}

$_SESSION['user_id'] = 1; // Dummy user ID
$_SESSION['logged_in'] = true;

echo json_encode(['ok' => true]);