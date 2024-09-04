import { fetchImages } from './js/pixabay-api.js';
import { renderGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import './css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#search-form');
  const gallery = document.querySelector('.gallery');
  const loadMoreButton = document.querySelector('.load-more');
  const loader = document.querySelector('.loader');
  let currentPage = 1;
  let currentQuery = '';

  function smoothScroll() {
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    currentQuery = event.currentTarget.elements.query.value.trim();
    if (!currentQuery) {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search query!',
      });
      return;
    }
    gallery.innerHTML = '';
    currentPage = 1;
    loadMoreButton.classList.add('hidden');
    loader.classList.add('visible');
    try {
      const data = await fetchImages(currentQuery, currentPage);
      if (data.hits.length === 0) {
        iziToast.error({
          title: 'Error',
          message: 'Sorry, there are no images matching your search query. Please try again!',
        });
      } else {
        renderGallery(data.hits);
        loadMoreButton.classList.remove('hidden');
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: error.message,
      });
    } finally {
      loader.classList.remove('visible');
    }
  });

  loadMoreButton.addEventListener('click', async () => {
    currentPage += 1;
    loader.classList.add('visible');
    try {
      const data = await fetchImages(currentQuery, currentPage);
      renderGallery(data.hits); 
      smoothScroll();  
      if (data.hits.length === 0 || currentPage * 12 >= data.totalHits) {
        loadMoreButton.classList.add('hidden');
        iziToast.info({
          title: 'Info',
          message: "We're sorry, but you've reached the end of search results.",
        });
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: error.message,
      });
    } finally {
      loader.classList.remove('visible');
    }
  });
});