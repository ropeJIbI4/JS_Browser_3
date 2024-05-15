const API_KEY = '!!!!!!!API_KEY!!!!!!!!!';
const PHOTO_URL = 'https://api.unsplash.com/photos/random';
const STORAGE_KEY = 'unsplash-photos';

let currentPhoto;
let likes = {};
let photoHistory = [];

async function getPhoto() {
    try {
        const response = await fetch(PHOTO_URL, {
            headers: {
                'Authorization': `Client-ID ${API_KEY}`
            }
        });
        const data = await response.json();
        currentPhoto = data;
        renderPhoto();
    } catch (error) {
        console.error(error);
    }
}

function renderPhoto() {
    const photoElement = document.getElementById('photo');
    const photoInfoElement = document.getElementById('photo-info');
    const likeButtonElement = document.getElementById('like-button');
    const likeCountElement = document.getElementById('like-count');

    photoElement.src = currentPhoto.urls.regular;
    photoInfoElement.textContent = `Photo by ${currentPhoto.user.name}`;

    likeButtonElement.addEventListener('click', toggleLike);
    likeCountElement.textContent = likes[currentPhoto.id] || 0;

    photoHistory.push(currentPhoto.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photoHistory));
}

async function toggleLike() {
    const likeButtonElement = document.getElementById('like-button');
    const likeCountElement = document.getElementById('like-count');

    if (likes[currentPhoto.id]) {
        likes[currentPhoto.id]--;
        likeButtonElement.textContent = 'Like';
    } else {
        likes[currentPhoto.id] = (likes[currentPhoto.id] || 0) + 1;
        likeButtonElement.textContent = 'Unlike';
    }

    likeCountElement.textContent = likes[currentPhoto.id];
    localStorage.setItem(`like-${currentPhoto.id}`, likes[currentPhoto.id]);
}

document.getElementById('prev-button').addEventListener('click', PreviousPhoto);

async function PreviousPhoto() {
    if (photoHistory.length > 1) {
        photoHistory.pop();
        const previousPhotoId = photoHistory[photoHistory.length - 1];
        const response = await fetch(`https://api.unsplash.com/photos/${previousPhotoId}`, {
            headers: {
                'Authorization': `Client-ID ${API_KEY}`
            }
        });
        const data = await response.json();
        currentPhoto = data;
        renderPhoto();
    } 
}

getPhoto();

photoHistory = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
likes = {};
photoHistory.forEach((photoId) => {
    likes[photoId] = parseInt(localStorage.getItem(`like-${photoId}`)) || 0;
});