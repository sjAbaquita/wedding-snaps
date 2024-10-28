$(document).ready(function () {
    // Fetch albums from the server
    $.getJSON('albums.php', function (albums) {
        const albumsContainer = $("#albumsContainer");

        // Display each album
        albums.forEach(function (album) {
            const albumElement = `
                <div class="album" data-album="${album.name}">
                    ${album.preview && album.preview.endsWith('.mp4') ? 
                        `<video controls>
                            <source src="${album.preview}" type="video/mp4">
                          </video>` :
                        `<img src="${album.preview}" alt="${album.name}">`}
                    <p>${album.name}</p>
                </div>`;
            albumsContainer.append(albumElement);
        });
    });

    // Handle album click
    $("#albumsContainer").on("click", ".album", function () {

        const albumName = $(this).data('album');

        $('#album-name').text(albumName);
        
        $('#myModal').fadeIn();
        
        // Fetch media for the selected album
        $.getJSON(`fetch_album.php?album=${albumName}`, function (mediaFiles) {
            const mediaPreviewContainer = $("#mediaPreviewContainer");
            mediaPreviewContainer.empty(); // Clear existing media

            // Display each image or video in the selected album
            mediaFiles.forEach(function (file) {
                const mediaElement = `
                    <div class="media-preview">
                        ${file.endsWith('.mp4') ? 
                            `<video controls>
                                <source src="${file}" type="video/mp4">
                              </video>` :
                            `<img src="${file}" alt="media">`}
                    </div>`;
                mediaPreviewContainer.append(mediaElement);
            });
        });
    });

    // Close the modal when clicking the close button
    $('.close').click(function() {
        $('#myModal').fadeOut();
    });

    // Close the modal when clicking outside the modal content
    $(window).click(function(event) {
        if ($(event.target).is('#myModal')) {
            $('#myModal').fadeOut();
        }
    });
});