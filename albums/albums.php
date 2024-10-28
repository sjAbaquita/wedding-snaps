<?php
$albumsDir = '../uploads/'; // Path to the uploads directory

// Get all album directories
$albums = array_filter(glob($albumsDir . '*'), 'is_dir');

$albumsData = [];
foreach ($albums as $album) {
    $albumName = basename($album);
    
    // Get images/videos from the album (only the first one for preview)
    $mediaFiles = array_filter(glob($album . '/*'), function($file) {
        return preg_match('/\.(jpg|jpeg|png|gif|mp4|avi|mkv)$/i', $file);
    });

    $preview = !empty($mediaFiles) ? $mediaFiles[0] : null; // Get first file as preview
    $albumsData[] = [
        'name' => $albumName,
        'preview' => $preview ? $preview : null,
    ];
}

header('Content-Type: application/json');
echo json_encode($albumsData);
?>
