import axios from 'axios';
import config from '../config';
import { UserData } from '@/types/user';

const api = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true,
    withXSRFToken: true,
    validateStatus: () => true,
});

api.get('/sanctum/csrf-cookie');

export const login = async (data: UserData) => {
    return api.post('/auth/login', data);
};

export const register = async (data: UserData) => {
    return api.post('/auth/register', data);
};

export const authenticated = async () => {
    return api.get('/auth');
};

export default api;