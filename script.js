document.addEventListener('DOMContentLoaded', function() {

     // Check if the terms have already been accepted
    let isTermsAccepted = localStorage.getItem('isTermsAccepted') === 'true';

    // Long terms of service text stored in a variable
    const fullTermsText = `
        <p>Last Updated: 08/01/2024</p>
        <p>Welcome to CanvasICraft! These Terms of Service ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Service.</p>
        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using the Service, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
        <h3>2. Changes to Terms</h3>
        <p>We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
        <h3>3. Use of the Service</h3>
        <h4>3.1 Eligibility</h4>
        <p>You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you meet this age requirement.</p>
        <h4>3.2 User Responsibilities</h4>
        <p>You agree not to use the Service to:</p>
        <ul>
            <li>Upload, post, or transmit any content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
            <li>Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
            <li>Violate any applicable local, state, national, or international law.</li>
        </ul>
        <h4>3.3 User Content</h4>
        <p>You retain all rights to the content you upload, post, or transmit through the Service ("User Content").</p>
        <h3>4. Privacy</h3>
        <p>Our Privacy Policy explains how we collect, use, and share information about you. By using the Service, you consent to our collection, use, and sharing of information as set forth in the Privacy Policy.</p>
        <h3>5. Prohibited Content and Activities</h3>
        <p>You agree not to upload, post, or transmit any User Content that:</p>
        <ul>
            <li>Is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or invasive of another's privacy.</li>
            <li>Encourages conduct that would constitute a criminal offense, give rise to civil liability, or otherwise violate any law.</li>
        </ul>
        <h3>6. Disclaimer of Warranties</h3>
        <p>The Service is provided "as is" and "as available" without any warranties of any kind, either express or implied. CanvasICraft does not warrant that the Service will be uninterrupted or error-free, nor does it make any warranty as to the results that may be obtained from the use of the Service.</p>
        <h3>7. Limitation of Liability</h3>
        <p>In no event shall CanvasICraft, its affiliates, or their respective officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:</p>
        <ul>
            <li>Your use or inability to use the Service;</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein;</li>
            <li>Any interruption or cessation of transmission to or from the Service;</li>
            <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our Service by any third party.</li>
        </ul>
        <h3>8. Indemnification</h3>
        <p>You agree to defend, indemnify, and hold harmless CanvasICraft, its affiliates, and their respective officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, arising out of or in any way connected with your access to or use of the Service, or your violation of these Terms.</p>
        <h3>9. Termination</h3>
        <p>We may terminate or suspend your access to the Service, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms. Upon termination, your right to use the Service will immediately cease.</p>
        <h3>10. Governing Law</h3>
        <p>These Terms shall be governed and construed in accordance with the laws of the European Union, without regard to its conflict of law provisions.</p>
        <h3>12. Contact Information</h3>
        <p>If you have any questions about these Terms, please contact us on Discord provided at the Home Page.</p>
    `;

    // Function to show the full terms of service
    function showFullTermsAlert() {
        Swal.fire({
            title: 'Full Terms of Service',
            html: fullTermsText,
            showCancelButton: true,
            confirmButtonText: 'Agree',
            cancelButtonText: 'No, redirect me to Google',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                isTermsAccepted = true;
                localStorage.setItem('isTermsAccepted', 'true');
                console.log('Terms accepted');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = 'https://www.google.com';
            }
        });
    }

    // Function to show terms of service alert
    function showTermsAlert() {
        Swal.fire({
            title: 'Terms of Service',
            html: 'By using this website you agree to our <a href="#" id="terms-link">terms of service</a>.',
            showCancelButton: true,
            confirmButtonText: 'Agree',
            cancelButtonText: 'No, redirect me to Google',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                isTermsAccepted = true;
                localStorage.setItem('isTermsAccepted', 'true');
                console.log('Terms accepted');
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                window.location.href = 'https://www.google.com';
            }
        });

        // Adding an event listener to the dynamically created link
        document.addEventListener('click', function(event) {
            if (event.target && event.target.id === 'terms-link') {
                event.preventDefault();
                showFullTermsAlert();
            }
        });
    }

    // Show the terms alert if they have not been accepted yet
    if (!isTermsAccepted) {
        showTermsAlert();
    }

//--------------------------------------------
//-------------------------------------------

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
        deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>'; // Set the innerHTML to include the Font Awesome icon
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
        // Check if the device is a mobile device (e.g., width less than or equal to 768px)
        if (window.innerWidth <= 768) {
            // Set the width to 100vw for mobile devices
            imgClone.style.width = '100vw';
            imgClone.style.height = 'auto'; // Maintain aspect ratio
        } else {
            // Set the height to 100vh for non-mobile devices
            imgClone.style.height = '100vh';
            imgClone.style.width = 'auto'; // Maintain aspect ratio
        }

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
        closeButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
        closeButton.className = 'fullScreenCloseButton';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });

        overlay.appendChild(closeButton);

       imgClone.addEventListener('click', function(event) {
            const rect = imgClone.getBoundingClientRect();
            const x = event.clientX;
            const y = event.clientY;

            // Get the total width and height of the device's screen
            const totalWidth = window.innerWidth;
            const totalHeight = window.innerHeight;

            // Normalize the x and y coordinates
            const normalizedX = (x / totalWidth);
            const normalizedY = (y / totalHeight);

            // Adjust redDot position based on the original x and y
            redDot.style.left = `${x - 5}px`; // Assuming the dot has a width of 10px, adjust by half.
            redDot.style.top = `${y - 5}px`; // Assuming the dot has a height of 10px, adjust by half.

            // Append or re-append the redDot to the overlay
            if (!dotPosition) {
                overlay.appendChild(redDot);
            } else {
                redDot.remove();
                overlay.appendChild(redDot);
            }

            // Save the normalized position
            dotPosition = { x: normalizedX, y: normalizedY };
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

        // Clone the image
        const imgClone = imageElement.cloneNode();

        // Check if the device is a mobile device (e.g., width less than or equal to 768px)
        if (window.innerWidth <= 768) {
            imgClone.style.width = '100vw';
            imgClone.style.height = 'auto'; // Maintain aspect ratio
        } else {
            imgClone.style.height = '100vh';
            imgClone.style.width = 'auto'; // Maintain aspect ratio
        }

        overlay.appendChild(imgClone);

        // Create a black overlay
        const blackOverlaySndBtn = document.createElement('div');
        blackOverlaySndBtn.className = 'blackOverlaySndBtn';
        overlay.appendChild(blackOverlaySndBtn);

        // Handle the dotPosition passed in or retrieved from localStorage
        const redDot = document.createElement('img');
        redDot.src = 'https://i.ibb.co/J27Q3KX/image.png'; // Updated URL for the red dot image
        redDot.className = 'red-dot';

        // If no dotPosition is passed in, attempt to retrieve it from localStorage
        if (!dotPosition) {
            let images = JSON.parse(localStorage.getItem('images'));
            if (!images) images = []; // Fallback if no images are stored
            const imageInfo = images.find(image => image.url === imageUrl);
            if (imageInfo && imageInfo.dotPosition) {
                dotPosition = imageInfo.dotPosition;
            }
        }

        // If dotPosition is found or passed in, position the red dot
        if (dotPosition) {
         // Get the total width and height of the device's screen
            const totalWidth = window.innerWidth;
            const totalHeight = window.innerHeight;

            // Calculate the absolute position based on the normalized dotPosition
            const absoluteX = dotPosition.x * totalWidth;
            const absoluteY = dotPosition.y * totalHeight;

            // Position the red dot on the screen
            redDot.style.position = 'absolute';
            redDot.style.left = `${absoluteX - 5}px`; // Adjust by half the size of the dot
            redDot.style.top = `${absoluteY - 5}px`;

            // Append the red dot to the overlay
            overlay.appendChild(redDot);
        }

        // Event listeners for mouse and touch events
        document.addEventListener('mousedown', function(event) {
            if (event.button === 0 && event.target === blackOverlaySndBtn) {
                hideOverlayAndRedDot();
            }
        });

        document.addEventListener('mouseup', function(event) {
            if (event.button === 0 && (event.target === imgClone || imgClone.contains(event.target) || event.target === overlay)) {
                showOverlayAndRedDot();
            }
        });

        document.addEventListener('touchstart', function(event) {
            if (event.target === blackOverlaySndBtn) {
                hideOverlayAndRedDot();
            }
        });

        document.addEventListener('touchend', function(event) {
            if (event.target === imgClone || imgClone.contains(event.target) || event.target === overlay) {
                showOverlayAndRedDot();
            }
        });

        // Function to hide the overlay and red dot
        function hideOverlayAndRedDot() {
            blackOverlaySndBtn.style.display = 'none';
            if (redDot) redDot.style.display = 'none';
        }

        // Function to show the overlay and red dot
        function showOverlayAndRedDot() {
            blackOverlaySndBtn.style.display = 'block';
            if (redDot) redDot.style.display = 'block';
        }

        // Add a specific button to close the overlay instead of using dblclick on the whole overlay
        const closeButton = document.createElement('button');
        closeButton.innerHTML = "<i class='fa-solid fa-xmark'></i>";
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
