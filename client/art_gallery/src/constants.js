<<<<<<< HEAD
export const ROOT_URL = 'http://localhost:8000';
// export const ROOT_URL = 'https://rustyag.herokuapp.com';
=======
export const ROOT_URL = 'https://rustyag.herokuapp.com/api';
>>>>>>> 24c0bab21f9bff1d12665857a0678764f0c2d3ee
export const GET_SEARCH_URL = `${ROOT_URL}/search/`;
export const GET_ARTIST_URL = `${ROOT_URL}/artist/`;
export const GET_ARTWORK_URL = `${ROOT_URL}/paintings/`;
export const GET_ART_MOVEMENT_URL = `${ROOT_URL}/art_movement/`;
export const GET_ARTIST_ARTWORKS_URL = (artistId) => `${ROOT_URL}/artist/${artistId}/paintings/`;
export const GET_POPULAR_ARTWORKS = `${ROOT_URL}/popular/`;

export const ARTIST_URL = '/artist/';
export const ARTWORK_URL = '/paintings/';
export const ART_MOVEMENT_URL = `${ROOT_URL}/art_movement/`;
export const ARTIST_ARTWORKS_URL = (artistId) => `/artist/${artistId}/paintings/`;

export const GRID_PAGE_SIZE = 5;
