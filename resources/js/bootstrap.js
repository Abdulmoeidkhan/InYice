import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Content-Type'] = 'application/json';

// Retrieve the token from localStorage
let store = JSON.parse(localStorage.getItem('inyiceuser'));  // Replace 'api_token' with the key where your token is stored
let token=store.token;
if (token) {
    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
