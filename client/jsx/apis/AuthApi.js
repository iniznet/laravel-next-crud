import Api from "./Api";
export const AuthAPI = {
    login: async (data) => {
        const response = await Api.post('/auth/login', data);
        if (response.success) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            return response.data;
        }
        throw { message: response.message, errors: response.errors };
    },
    register: async (data) => {
        const response = await Api.post('/auth/register', data);
        if (response.success) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            return response.data;
        }
        throw { message: response.message, errors: response.errors };
    },
    authenticated: async () => {
        const response = await Api.get('/auth');
        if (response.success)
            return response.data?.data;
        return null;
    },
    logout: async () => {
        const response = await Api.post('/auth/logout');
        if (response.success) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return response.data;
        }
        throw new Error(response.message);
    },
    refreshToken: async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        const response = await Api.post('/auth/refresh', { refresh_token });
        if (response.success) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            return response.data;
        }
        throw new Error(response.message);
    },
};
