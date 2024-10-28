$(document).ready(function () {
    const dragDropZone = $('#dragDropZone');
    let selectedFiles = []; // Store selected files

    // Event handlers for drag-and-drop
    dragDropZone.on('dragover', function (e) {
        e.preventDefault();
        dragDropZone.addClass('drag-over');
    });

    dragDropZone.on('dragleave', function () {
        dragDropZone.removeClass('drag-over');
    });

    dragDropZone.on('drop', function (e) {
        e.preventDefault();
        dragDropZone.removeClass('drag-over');
        const files = e.originalEvent.dataTransfer.files;
        handleFileSelection(files);
    });

    dragDropZone.on('click', function () {
        $('<input type="file" multiple accept="image/*,video/*">').on('change', function (e) {
            handleFileSelection(e.target.files);
        }).click();
    });

    function handleFileSelection(files) {
        if ($('#albumName').val().trim() === "") {
            alert('Please enter an album name.');
            return;
        }

        Array.from(files).forEach((file, index) => {
            selectedFiles.push(file);
            addImagePreview(file, selectedFiles.length - 1);
        });
        
        uploadFilesToAlbum();
    }

    // Function to add image/video preview
    function addImagePreview(file, index) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const mediaType = file.type.startsWith("video") ? "video" : "img";
            const mediaElement = `
                <div class="image-preview" data-index="${index}">
                    ${mediaType === "video" 
                        ? `<video src="${e.target.result}" controls></video>` 
                        : `<img src="${e.target.result}" alt="Preview">`}
                    <div class="progress-bar"></div>
                </div>`;
            $('#imagePreviewContainer').append(mediaElement);
        };

        reader.readAsDataURL(file);
    }

    function uploadFilesToAlbum() {
        const albumName = $('#albumName').val().trim();
        selectedFiles.forEach((file, index) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('album', albumName);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/drag-drop-upload.php', true);

            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    $(`.image-preview[data-index='${index}'] .progress-bar`).css('width', percentComplete + '%');
                }
            };

            xhr.onload = function () {
                if (xhr.status === 200) {
                    $(`.image-preview[data-index='${index}'] .loading-text`).text('Uploaded');
                } else {
                    $(`.image-preview[data-index='${index}'] .loading-text`).text('Error');
                }
            };

            xhr.send(formData);
        });
    }
});