import api from '../config/api';

export async function getNames() {
    try {
        const response = await api.get('/names');
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve upcoming names: ${JSON.stringify(err)}`);
    }
}

export async function getUserCurrentName(userId) {
    try {
        const response = await api.get(`/users/${userId}`);
        console.log('response', response);
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve current name for user id ${userId}: ${JSON.stringify(err)}`);
    }
}

export async function submitNewName(newName, userId) {
    try {
        const response = await api.post(`/users/${userId}`, newName);
        console.log('response', response);
        return response.data;
    } catch (err) {
        console.error(`Failed to submit new name: ${JSON.stringify(err)}`);
    }
}

export async function getUserNameHistory(userId) {
    try {
        const response = await api.get(`/users/${userId}/history`);
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve user's name history: ${JSON.stringify(err)}`);
    }
}

