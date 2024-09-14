// =====================================================   TASK 1 CodeAlpha   =====================================================
const apiKey = 'GzyPN3ExzhEsPjb8Oqr10dcSRTUgUZ1dgKMSUyWoBH7G5sNwutkplgLh';
let currentQuery = '';
let page = 1;
let images = []; // To store all image URLs

// Function to load images from Pexels based on the selected city
function loadImages(query, page) {
    const url = `https://api.pexels.com/v1/search?query=${query}%20egypt&per_page=15&page=${page}`;
    
    // Show "Loading" state on the button
    const loadMoreButton = document.getElementById('loadMore');
    loadMoreButton.textContent = 'Loading...';
    loadMoreButton.disabled = true;

    fetch(url, {
        headers: { Authorization: apiKey }
    })
    .then(response => response.json())
    .then(data => {
        addImagesToGallery(data.photos, query);
        // Restore original button text after loading
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.disabled = false;
    });
}

// Function to add images to the gallery and update images for Lightbox
function addImagesToGallery(photos, query) {
    const imagesWrapper = document.getElementById('imageGallery');
    const fragment = document.createDocumentFragment();

    photos.forEach((photo) => {
        const li = document.createElement('li');
        li.classList.add('card');
        const imgElement = document.createElement('img');
        imgElement.src = photo.src.large2x;
        imgElement.alt = photo.photographer;

        li.innerHTML = `
            <div class="details">
                <div class="location">
                    <i class="uil uil-map-marker"></i>
                    <span>${query}</span>
                </div>
            </div>
        `;
        li.prepend(imgElement);
        fragment.appendChild(li);

        // Save image for Lightbox and set correct index
        const imageIndex = images.length;
        images.push(photo.src.large2x);

        // Add click event to open the image in Lightbox
        imgElement.addEventListener('click', function () {
            showLightbox(imageIndex);
        });
    });

    imagesWrapper.appendChild(fragment);
}

// Add event listeners to buttons to activate the filter based on the city
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('imageGallery').innerHTML = '';
        images = [];  // Reset images for Lightbox
        currentQuery = this.getAttribute('data-filter');
        page = 1;
        loadImages(currentQuery, page);
    });
});

// "Load More" button to load additional images
document.getElementById('loadMore').addEventListener('click', function() {
    if (currentQuery) {
        page++;
        loadImages(currentQuery, page);
    }
});

// Load initial images when the page loads
document.addEventListener('DOMContentLoaded', () => {
    currentQuery = 'Giza';  // Set default city keyword
    loadImages(currentQuery, page);
});

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentImageIndex = 0;

// Function to display the selected image in Lightbox
function showLightbox(index) {
    currentImageIndex = index;
    lightbox.style.display = 'block';
    lightboxImage.src = images[currentImageIndex];
}

// Close Lightbox when the close button is clicked
closeBtn.addEventListener('click', function() {
    lightbox.style.display = 'none';
});

// Navigate between images
nextBtn.addEventListener('click', function() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showLightbox(currentImageIndex);
});

prevBtn.addEventListener('click', function() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showLightbox(currentImageIndex);
});

// Close Lightbox when clicking outside the image
lightbox.addEventListener('click', function(e) {
    if (e.target !== lightboxImage && e.target !== nextBtn && e.target !== prevBtn) {
        lightbox.style.display = 'none';
    }
});

// =====================================================  END TASK 1 CodeAlpha   =====================================================