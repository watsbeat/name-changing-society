import api from '../config/api';

export async function loginUser(userData) {
    const response = await api.post('/auth/login', userData);
    return response.data;
}

export async function logoutUser() {
    return api.get('/auth/logout');
}

export async function registerUser(userDetails) {
    const response = await api.post('/auth/register', userDetails);
    return response.data;
}

export function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
}

// Store loggedInUser username in local storage
export function setLoggedInUser(user) {
    user ? localStorage.setItem('loggedInUser', user) : localStorage.removeItem('loggedInUser');
}
