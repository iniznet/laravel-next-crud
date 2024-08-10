import axios, {
    AxiosInstance,
    AxiosResponse,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
} from 'axios';
import config from '@/app/config';

interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data?: T;
    errors?: any;
}

class Api {
    private instance: AxiosInstance;
    private isRefreshing = false;
    private refreshSubscribers: ((token: string) => void)[] = [];

    constructor() {
        this.instance = axios.create({
            baseURL: config.apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            validateStatus: () => true,
        });

        this.instance.interceptors.request.use(this.handleRequest);
        this.instance.interceptors.response.use(
            (response) => response,
            this.handleResponseError
        );
    }

    private handleRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    };

    private handleResponseError = async (error: any) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (this.isRefreshing) {
                return new Promise((resolve) => {
                    this.refreshSubscribers.push((token: string) => {
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
            } catch (refreshError) {
                // Handle refresh token failure (e.g., logout user)
                return Promise.reject(refreshError);
            } finally {
                this.isRefreshing = false;
            }
        }
        return Promise.reject(this.handleError(error));
    };

    private async refreshToken(): Promise<AxiosResponse> {
        const refresh_token = localStorage.getItem('refresh_token');
        return this.instance.post('/auth/refresh', { refresh_token });
    }

    private handleError(error: any): ApiResponse<null> {
        if (error.response) {
            const { status, data } = error.response;
            return {
                success: false,
                statusCode: status,
                message: data?.message || 'Request failed',
                errors: data?.errors || null,
            };
        } else {
            return {
                success: false,
                statusCode: 500,
                message: 'Network error',
                errors: null,
            };
        }
    }

    private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
        let results;
        const { status, data } = response;
        if (status >= 200 && status < 300) {
            results = {
                success: true,
                statusCode: status,
                message: 'Request was successful',
                data: data,
            };
        } else {
            results = {
                success: false,
                statusCode: status,
                message: data?.message || 'Request failed',
                errors: data?.errors || null,
            };
        }

        return results;
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.get<T>(url, config);
        return this.handleResponse(response);
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.post<T>(url, data, config);
        return this.handleResponse(response);
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.put<T>(url, data, config);
        return this.handleResponse(response);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        const response = await this.instance.delete<T>(url, config);
        return this.handleResponse(response);
    }
}

export default new Api();
