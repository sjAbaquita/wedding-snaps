<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file']) && isset($_POST['album'])) {
    $uploadsDir = './uploads/';
    $albumName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['album']); // Sanitize album name
    $albumDir = $uploadsDir . $albumName;

    // Create album folder if it doesn't exist
    if (!is_dir($albumDir)) {
        mkdir($albumDir, 0777, true);
    }

    // Handle file upload
    $file = $_FILES['file'];
    $filePath = $albumDir . '/' . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $filePath)) {
        echo json_encode(['status' => 'success', 'path' => $filePath]);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload file.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request.']);
}
?>
