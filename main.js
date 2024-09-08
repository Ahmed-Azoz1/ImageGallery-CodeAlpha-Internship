const apiKey = 'GzyPN3ExzhEsPjb8Oqr10dcSRTUgUZ1dgKMSUyWoBH7G5sNwutkplgLh';
let currentQuery = '';
let page = 1;
let images = []; // لتخزين جميع الروابط الخاصة بالصور

// دالة لتحميل الصور من Pexels بناءً على المدينة المختارة
function loadImages(query, page) {
    const url = `https://api.pexels.com/v1/search?query=${query}%20egypt&per_page=15&page=${page}`;
    
    // إظهار حالة "Loading" على الزر
    const loadMoreButton = document.getElementById('loadMore');
    loadMoreButton.textContent = 'Loading...';
    loadMoreButton.disabled = true;

    fetch(url, {
        headers: { Authorization: apiKey }
    })
    .then(response => response.json())
    .then(data => {
        addImagesToGallery(data.photos, query);
        // إعادة النص الأصلي للزر بعد اكتمال التحميل
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.disabled = false;
    })
    .catch(error => {
        console.error('Error:', error);
        loadMoreButton.textContent = 'Load More';
        loadMoreButton.disabled = false;
    });
}

// دالة لإضافة الصور إلى المعرض وتحديث الصور للـ Lightbox
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

        // حفظ الصورة للـ Lightbox وتحديد الفهرس بشكل صحيح
        const imageIndex = images.length;
        images.push(photo.src.large2x);

        // ربط حدث النقر على الصورة لفتحها في الـ Lightbox
        imgElement.addEventListener('click', function () {
            showLightbox(imageIndex);
        });
    });

    imagesWrapper.appendChild(fragment);
}

// إضافة event listeners للأزرار لتفعيل الفلتر بناءً على المدينة
document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('imageGallery').innerHTML = '';
        images = [];  // إعادة تعيين الصور للـ Lightbox
        currentQuery = this.getAttribute('data-filter');
        page = 1;
        loadImages(currentQuery, page);
    });
});

// زر "Load More" لتحميل المزيد من الصور
document.getElementById('loadMore').addEventListener('click', function() {
    if (currentQuery) {
        page++;
        loadImages(currentQuery, page);
    }
});

// تحميل الصور الأولية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    currentQuery = 'Giza';  // تعيين كلمة مفتاحية افتراضية للمدينة
    loadImages(currentQuery, page);
});

// --- Lightbox ---
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let currentImageIndex = 0;

// دالة لعرض الصورة المحددة في Lightbox
function showLightbox(index) {
    currentImageIndex = index;
    lightbox.style.display = 'block';
    lightboxImage.src = images[currentImageIndex];
}

// إغلاق Lightbox عند الضغط على زر الإغلاق
closeBtn.addEventListener('click', function() {
    lightbox.style.display = 'none';
});

// التنقل بين الصور
nextBtn.addEventListener('click', function() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showLightbox(currentImageIndex);
});

prevBtn.addEventListener('click', function() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    showLightbox(currentImageIndex);
});

// إغلاق الـ Lightbox عند الضغط في أي مكان خارج الصورة
lightbox.addEventListener('click', function(e) {
    if (e.target !== lightboxImage && e.target !== nextBtn && e.target !== prevBtn) {
        lightbox.style.display = 'none';
    }
});
