// utils/api.ts
import axios from 'axios';
import config from '../config';
import { UserData } from '../types/User';

const api = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    withXSRFToken: true,
});

api.get('/sanctum/csrf-cookie');

console.log('api.defaults.headers', api.defaults.headers);

export const login = async (data: UserData) => {
    return api.post('/auth/login', data);
};

export const register = async (data: UserData) => {
    return api.post('/auth/register', data);
};

export default api;