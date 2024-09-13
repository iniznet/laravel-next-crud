import axios from 'axios';
import config from '@/app/config';
class Api {
    constructor() {
        this.isRefreshing = false;
        this.refreshSubscribers = [];
        this.handleRequest = async (config) => {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers = config.headers || {};
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        };
        this.handleResponseError = async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                if (this.isRefreshing) {
                    return new Promise((resolve) => {
                        this.refreshSubscribers.push((token) => {
                            originalRequest.headers['Authorization'] = 'Bearer ' + token;
                            resolve(this.instance(originalRequest));
                        });
                    });
                }
                originalRequest._retry = true;
                this.isRefreshing = true;
                try {
                    const response = await this.refreshToken();
                    const { access_token } = response.data;
                    localStorage.setItem('access_token', access_token);
                    this.instance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
                    this.refreshSubscribers.forEach((callback) => callback(access_token));
                    this.refreshSubscribers = [];
                    return this.instance(originalRequest);
                }
                catch (refreshError) {
                    // Handle refresh token failure (e.g., logout user)
                    return Promise.reject(refreshError);
                }
                finally {
                    this.isRefreshing = false;
                }
            }
            return Promise.reject(this.handleError(error));
        };
        this.instance = axios.create({
            baseURL: config.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            validateStatus: () => true,
        });
        this.instance.interceptors.request.use(this.handleRequest);
        this.instance.interceptors.response.use((response) => response, this.handleResponseError);
    }
    async refreshToken() {
        const refresh_token = localStorage.getItem('refresh_token');
        return this.instance.post('/auth/refresh', { refresh_token });
    }
    handleError(error) {
        if (error.response) {
            const { status, data } = error.response;
            return {
                success: false,
                statusCode: status,
                message: data?.message || 'Request failed',
                errors: data?.errors || null,
            };
        }
        else {
            return {
                success: false,
                statusCode: 500,
                message: 'Network error',
                errors: null,
            };
        }
    }
    handleResponse(response) {
        let results;
        const { status, data } = response;
        if (status >= 200 && status < 300) {
            results = {
                success: true,
                statusCode: status,
                message: 'Request was successful',
                data: data,
            };
        }
        else {
            results = {
                success: false,
                statusCode: status,
                message: data?.message || 'Request failed',
                errors: data?.errors || null,
            };
        }
        return results;
    }
    async get(url, config) {
        const response = await this.instance.get(url, config);
        return this.handleResponse(response);
    }
    async post(url, data, config) {
        const response = await this.instance.post(url, data, config);
        return this.handleResponse(response);
    }
    async put(url, data, config) {
        const response = await this.instance.put(url, data, config);
        return this.handleResponse(response);
    }
    async delete(url, config) {
        const response = await this.instance.delete(url, config);
        return this.handleResponse(response);
    }
}
export default new Api();
