export const ROOT_URL = 'https://rustyag.herokuapp.com';
export const GET_SEARCH_URL = `${ROOT_URL}/search/`;
export const GET_ARTIST_URL = `${ROOT_URL}/artist/`;
export const GET_ARTWORK_URL = `${ROOT_URL}/paintings/`;
export const GET_ART_MOVEMENT_URL = `${ROOT_URL}/art_movement/`;
export const GET_ARTIST_ARTWORKS_URL = (artistId) => `${ROOT_URL}/artist/${artistId}/paintings/`;