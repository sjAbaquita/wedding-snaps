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
		
        if ($('#albumName').val().trim() === "") {
            alert('Please enter an album name.');
            return;
        }

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
        
        // uploadFilesToAlbum();
		uploadFilesSequentially();
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
					<div class="loading-text">Uploading...</div>
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

			xhr.timeout = 300000;

            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    $(`.image-preview[data-index='${index}'] .progress-bar`).css('width', percentComplete + '%');
                    $(`.image-preview[data-index='${index}'] .loading-text`).text(percentComplete);
                }
            };

            xhr.onload = function () {
                if (xhr.status === 200) {
                    $(`.image-preview[data-index='${index}'] .loading-text`).text('Uploaded');
					$(`.image-preview[data-index='${index}'] .progress-bar`).css('background-color', 'green');
                } else {
                    $(`.image-preview[data-index='${index}'] .loading-text`).text('Error');
                }
            };

			xhr.ontimeout = function () {
				$(`.image-preview[data-index='${index}'] .loading-text`).text('Timed Out');
			};

			xhr.onerror = function () {
				$(`.image-preview[data-index='${index}'] .loading-text`).text('Failed');
			};

            xhr.send(formData);
        });
    }


	async function uploadFilesSequentially() {
        const albumName = $('#albumName').val().trim();
        for (let index = 0; index < selectedFiles.length; index++) {
            await uploadFile(selectedFiles[index], albumName, index);
        }
    }

    // Function to handle the upload of a single file
    function uploadFile(file, albumName, index) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('album', albumName);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/drag-drop-upload.php', true);
            xhr.timeout = 300000; // Set timeout to 5 minutes

            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    $(`.image-preview[data-index='${index}'] .progress-bar`).css('width', percentComplete + '%');
                    $(`.image-preview[data-index='${index}'] .loading-text`).text(`${Math.round(percentComplete)}%`);
                }
            };

            xhr.onload = function () {
                if (xhr.status === 200) {
                    $(`.image-preview[data-index='${index}'] .loading-text`).text('Uploaded');
                    $(`.image-preview[data-index='${index}'] .progress-bar`).css('background-color', 'green');
                    resolve(); // Resolve promise when upload is complete
                } else {
                    $(`.image-preview[data-index='${index}'] .loading-text`).text('Error');
                    reject();
                }
            };

            xhr.onerror = function () {
                $(`.image-preview[data-index='${index}'] .loading-text`).text('Failed');
                reject();
            };

            xhr.ontimeout = function () {
                $(`.image-preview[data-index='${index}'] .loading-text`).text('Timed Out');
                reject();
            };

            xhr.send(formData); // Send the form data
        });
    }
});