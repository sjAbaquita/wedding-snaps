<?php
$albumName = $_GET['album'] ?? '';

$albumsDir = '../uploads/'; // Path to the uploads directory
$albumPath = $albumsDir . $albumName;

if (is_dir($albumPath)) {
    // Get all media files (images and videos)
    $mediaFiles = array_filter(glob($albumPath . '/*'), function($file) {
        return preg_match('/\.(jpg|jpeg|png|gif|mp4|avi|mkv)$/i', $file);
    });

    header('Content-Type: application/json');
    echo json_encode($mediaFiles);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Album not found"]);
}
?>
