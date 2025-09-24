<?php
// /api/me.php
declare
session_start();
haeder('Content-Type: application/json; charset=utf-8');


// 
if (empty($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Not authenticated']);
    exit;
}


// load user data from JSON; 
$jsonPath = __DIR__ . '/../data/user.json';
if (!file_exists($jsonPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'User data not found']);
    exit;
}


$user = json_decode(file_get_contents($jsonPath), true);
echo json_encode(['ok' => true, 'user' => $user]);