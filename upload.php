<?php
$target_root_dir = "uploads/"; // Root uploads directory
$albumName = $_POST['albumName'];

// Sanitize the album name (remove spaces and special characters)
$albumName = preg_replace('/[^A-Za-z0-9_\-]/', '', $albumName);

// Create the album directory if it doesn't exist
$target_dir = $target_root_dir . $albumName . "/";

if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true); // Create the directory with permissions
}

$uploadOk = 1;

// Loop through each uploaded file
foreach ($_FILES["media"]["name"] as $key => $name) {
    $target_file = $target_dir . basename($name);
    $uploadOk = 1;
    $mediaFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check file size (limit to 50MB per file)
    if ($_FILES["media"]["size"][$key] > 5000000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    // Allow certain file formats for images and videos
    $allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi', 'wmv'];
    if (!in_array($mediaFileType, $allowed_types)) {
        echo "Sorry, only JPG, JPEG, PNG, GIF, MP4, MOV, AVI & WMV files are allowed.";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    } else {
        // Move the uploaded file to the album folder
        if (move_uploaded_file($_FILES["media"]["tmp_name"][$key], $target_file)) {
            echo "The file " . htmlspecialchars(basename($name)) . " has been uploaded to album $albumName.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}
?>