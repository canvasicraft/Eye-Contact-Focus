document.addEventListener('DOMContentLoaded', function() {
    const grid = new Muuri('#gallery-container', {
        items: '.image-wrapper',
        dragEnabled: true,
        layoutEasing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        layout: {
            fillGaps: false,
            horizontal: false,
            alignRight: false,
            alignTop: true,
            rounding: false
        }
    });

    loadImagesFromStorage();

    // Retrieve URL parameters to check if the page was loaded with specific instructions for an image
    const params = new URLSearchParams(window.location.search);
    const imageUrl = params.get('url');
    const x = params.get('x');
    const y = params.get('y');

    // If all necessary parameters are present, load and display the image with overlay
    if (imageUrl && x && y) {
        const img = new Image();
        img.src = imageUrl;
        img.onload = function() {
            if (imageUrl && x && y) {
                openFullscreenWithOverlay(img, imageUrl, {x: parseInt(x), y: parseInt(y)});
            }
        };
    }

    document.getElementById('add-image').addEventListener('click', function() {
        const imageUrl = document.getElementById('image-url').value;
        if (imageUrl) {
            createGridItem(imageUrl, function(item) {
                grid.add(item);
                grid.layout();
                saveImageUrl(imageUrl);
                document.getElementById('image-url').value = '';
            });
        }
    });

    function saveImageUrl(url) {
        let images = localStorage.getItem('images');
        images = images ? JSON.parse(images) : [];
        images.push({ url, dotPosition: null });
        localStorage.setItem('images', JSON.stringify(images));
    }

    function loadImagesFromStorage() {
        let images = localStorage.getItem('images');
        if (images) {
            images = JSON.parse(images);
            images.forEach(function(image) {
                createGridItem(image.url, function(item) {
                    grid.add(item);
                });
            });
            grid.layout();
        }
    }

    function createGridItem(url, callback) {
        const itemElem = document.createElement('div');
        itemElem.className = 'item image-wrapper';
        const imgElem = document.createElement('img');
        imgElem.src = url;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        // Create three buttons
        const buttonActions = [
            {
                text: 'Place Red Dot',
                action: function() {
                    openFullscreen(imgElem, url);
                }
            },
            {
                text: 'Focus on Red Dot',
                action: function() {
                    openFullscreenWithOverlay(imgElem, url);
                }
            },
            {
                text: 'Share Link',
                action: function() {
                    const imageUrl = imgElem.src;  // Ensures it gets the correct URL from the image element
                    const shareLink = generateShareLink(imageUrl);
                    if (shareLink) {
                        navigator.clipboard.writeText(shareLink).then(() => {
                            alert('Link copied to clipboard!');
                        }).catch(err => {
                            console.error('Failed to copy:', err);
                        });
                    } else {
                        alert('No dot position saved for this image.');
                    }
                }
            }
        ];

        buttonActions.forEach((buttonConfig) => {
            const button = document.createElement('button');
            button.className = 'image-button';
            button.textContent = buttonConfig.text;
            button.addEventListener('click', buttonConfig.action);
            buttonContainer.appendChild(button);
        });

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; // Set the innerHTML to include the Font Awesome icon update
        deleteButton.addEventListener('click', function() {
            removeImageFromStorage(url); // Call a function to handle the removal from storage
            itemElem.remove(); // Remove the element from the DOM
        });

        imgElem.onload = function() {
            itemElem.appendChild(imgElem);
            itemElem.appendChild(buttonContainer);
            itemElem.appendChild(deleteButton);
            callback(itemElem);
        };

        imgElem.onerror = function() {
            console.error('Error loading image.');
            itemElem.remove();
        };
    }

    function removeImageFromStorage(imageUrl) {
        let images = JSON.parse(localStorage.getItem('images')) || [];
        images = images.filter(image => image.url !== imageUrl);
        localStorage.setItem('images', JSON.stringify(images));
        window.location.reload();
    }

    function openFullscreen(imageElement, imageUrl) {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        const imgClone = imageElement.cloneNode();
        imgClone.style.height = '100vh';
        overlay.appendChild(imgClone);

        const redDot = document.createElement('img');
        redDot.src = 'red-dot.png';
        redDot.className = 'red-dot';
        let dotPosition = null;

        // Retrieve dot position from local storage
        const images = JSON.parse(localStorage.getItem('images'));
        const imageInfo = images.find(image => image.url === imageUrl);
        if (imageInfo && imageInfo.dotPosition) {
            dotPosition = imageInfo.dotPosition;
            redDot.style.left = `${dotPosition.x - 5}px`; // Adjust by half the size of the dot
            redDot.style.top = `${dotPosition.y - 5}px`;
            overlay.appendChild(redDot); // Place the red dot immediately if position is found
        }

        // Create close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'fullScreenCloseButton';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(closeButton);

        imgClone.addEventListener('click', function(event) {
            const rect = imgClone.getBoundingClientRect();
            const x = event.clientX;
            const y = event.clientY;

            redDot.style.left = `${x - 5}px`; // Assuming the dot has a width of 10px, adjust by half.
            redDot.style.top = `${y - 5}px`; // Assuming the dot has a height of 10px, adjust by half.

            if (!dotPosition) {
                overlay.appendChild(redDot);
            } else {
                redDot.remove();
                overlay.appendChild(redDot);
            }

            dotPosition = { x, y };
            saveDotPosition(imageUrl, dotPosition);
        });

        overlay.addEventListener('dblclick', function() {
            document.body.removeChild(overlay);
        });
    }




    function saveDotPosition(imageUrl, position) {
        let images = JSON.parse(localStorage.getItem('images'));
        const imageIndex = images.findIndex(image => image.url === imageUrl);
        images[imageIndex].dotPosition = position;
        localStorage.setItem('images', JSON.stringify(images));
    }


    function openFullscreenWithOverlay(imageElement, imageUrl, dotPosition = null) {
        // Create and style the overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        document.body.appendChild(overlay);

        // Clone the image and set it to full screen height
        const imgClone = imageElement.cloneNode();
        imgClone.style.height = '100vh';
        overlay.appendChild(imgClone);

        // Create a black overlay
        const blackOverlaySndBtn = document.createElement('div');
        blackOverlaySndBtn.className = 'blackOverlaySndBtn';
        overlay.appendChild(blackOverlaySndBtn);

        // Retrieve saved dot position from local storage
        const images = JSON.parse(localStorage.getItem('images'));
        const imageInfo = images.find(image => image.url === imageUrl);
        const redDot = document.createElement('img');
        redDot.src = 'https://github.com/canvasicraft/Eye-Contact-Focus/blob/main/red-dot.png?raw=true';
        redDot.className = 'red-dot';
        if (imageInfo && imageInfo.dotPosition) {
            const dotPosition = imageInfo.dotPosition;
            redDot.style.position = 'absolute';
            redDot.style.left = `${dotPosition.x - 5}px`; // Adjust by half the size of the dot
            redDot.style.top = `${dotPosition.y - 5}px`;
            overlay.appendChild(redDot);
        }
        if (!dotPosition) {
            const images = JSON.parse(localStorage.getItem('images'));
            const imageInfo = images.find(image => image.url === imageUrl);
            if (imageInfo && imageInfo.dotPosition) {
                dotPosition = imageInfo.dotPosition;
            }
        }

        // Add event listeners for mouse down and up to control the overlay visibility
        document.addEventListener('mousedown', function(event) {
            if (event.button === 0 && (event.target === blackOverlaySndBtn)) {
                blackOverlaySndBtn.style.display = 'none';
                if (redDot) redDot.style.display = 'none';
            }
        });

        document.addEventListener('mouseup', function(event) {
            if (event.button === 0 && (event.target === imgClone || imgClone.contains(event.target) || event.target === overlay)) {
                blackOverlaySndBtn.style.display = 'block';
                 if (redDot) redDot.style.display = 'block';
            }
        });

        // Add a specific button to close the overlay instead of using dblclick on the whole overlay
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'fullScreenCloseButton';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(closeButton);
    }

    //Used for the image share, this generate the link in such a way that it opens in (openFullScreenOverlay)
    function generateShareLink(imageUrl) {
        const images = JSON.parse(localStorage.getItem('images'));
        const imageInfo = images.find(image => image.url === imageUrl);
        if (imageInfo && imageInfo.dotPosition) {
            const queryParams = new URLSearchParams({
                url: imageUrl,
                x: imageInfo.dotPosition.x,
                y: imageInfo.dotPosition.y
            }).toString();
            return `https://canvasicraft.github.io/Eye-Contact-Focus/?${queryParams}`;
        }
        return ''; // Return an empty string if no position is saved
    }


});
