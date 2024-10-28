let selectedFiles = []; // Array to store selected files

    $(document).ready(function () {
        // Check if album name is entered
        $('#albumName').on('input', function () {
            const albumName = $(this).val().trim();
            if (albumName) {
                $("#mediaUpload").prop('disabled', false); // Enable file input if album name is provided
            } else {
                $("#mediaUpload").prop('disabled', true); // Disable file input if album name is empty
            }
        });
        
        $("#mediaUpload").on("change", function () {
            const files = this.files;

            // Add new files to the selectedFiles array and preview them
            for (let i = 0; i < files.length; i++) {
                selectedFiles.push(files[i]);
                addMediaPreview(files[i], selectedFiles.length - 1); // Add the new media preview
            }

            // Automatically upload media once they are selected
            uploadMedia();

            // Clear the file input to allow for re-selection of files
            $("#mediaUpload").val("");
        });

        // Function to add the preview of a new image or video with a progress bar
        function addMediaPreview(file, index) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const mediaPreview = `
                    <div class="media-preview" data-index="${index}">
                        ${file.type.startsWith('video/') ? 
                            `<video controls>
                                <source src="${e.target.result}" type="${file.type}">
                                Your browser does not support the video tag.
                             </video>` :
                            `<img src="${e.target.result}" alt="Preview">`}
                        <span class="remove" data-index="${index}">X</span>
                        <div class="progress-bar"></div>
                        <div class="loading">Uploading...</div>
                    </div>`;
                $("#mediaPreviewContainer").append(mediaPreview);
            };

            reader.readAsDataURL(file); // Convert media to base64 string
        }

        // Remove media preview and the file from the array
        $("#mediaPreviewContainer").on("click", ".remove", function () {
            const index = $(this).data("index");
            selectedFiles.splice(index, 1); // Remove the file from the array

            // Remove the preview without re-rendering the entire list
            $(this).parent().remove();

            // Update the indices of remaining previews and files
            $("#mediaPreviewContainer .media-preview").each(function (i, elem) {
                $(elem).attr('data-index', i);
                $(elem).find('.remove').attr('data-index', i);
            });
        });

        // Function to automatically upload the selected files with progress tracking
        function uploadMedia() {
            const albumName = $("#albumName").val().trim();
            if (!albumName) {
                alert("Please enter an album name.");
                return;
            }

            selectedFiles.forEach(function (file, index) {
                const formData = new FormData();
                formData.append('media[]', file);
                formData.append('albumName', albumName); // Send the album name

                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/upload.php', true);

                // Track upload progress
                xhr.upload.onprogress = function (e) {
                    if (e.lengthComputable) {
                        const percentComplete = (e.loaded / e.total) * 100;
                        $(`.media-preview[data-index='${index}'] .progress-bar`).css('width', percentComplete + '%');
                    }
                };

                // On successful upload
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        $(`.media-preview[data-index='${index}'] .loading`).text('Completed');
                        $(`.media-preview[data-index='${index}'] .progress-bar`).css('background-color', 'blue');
                    } else {
                        $(`.media-preview[data-index='${index}'] .loading`).text('Error');
                    }
                };

                xhr.onerror = function () {
                    $(`.media-preview[data-index='${index}'] .loading`).text('Failed');
                };

                xhr.send(formData); // Send the form data for upload
            });
        }
    });