import axios from 'axios';

const API_KEY = '44474064-e47939977861edfa0fa12c2ac';
const BASE_URL = 'https://pixabay.com/api/';

export async function fetchImages(query, page = 1) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 15,
    },
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch images');
  }
  return response.data;
}