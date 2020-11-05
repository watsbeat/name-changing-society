import api from '../config/api';

export async function loginUser(userData) {
    const response = await api.post('/auth/login', userData);
    console.log('User data received: ', response);
    return response.data;
}

export async function logoutUser() {
    return api.get('/auth/logout');
}

export async function registerUser(userDetails) {
    const response = await api.post('/auth/register', userDetails);
    console.log('New user received from server', response);
    return response.data;
}

export function getLoggedInUser() {
    return localStorage.getItem('loggedInUser');
}

// Store loggedInUser username in local storage
export function setLoggedInUser(user) {
    console.log('setting user: ', user);
    user ? localStorage.setItem('loggedInUser', user) : localStorage.removeItem('loggedInUser');
}
