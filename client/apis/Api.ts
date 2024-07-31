import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
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

    constructor() {
        this.instance = axios.create({
            baseURL: config.apiUrl,
            withCredentials: true,
            withXSRFToken: true,
            validateStatus: () => true,
        });

        this.instance.interceptors.response.use(
            (response) => response, // Keep the response intact
            (error) => Promise.reject(this.handleError(error))
        );

        this.initializeCsrf();
    }

    private handleResponse<T>(response: AxiosResponse): ApiResponse<T> {
        const { status, data } = response;
        if (status >= 200 && status < 300) {
            return {
                success: true,
                statusCode: status,
                message: 'Request was successful',
                data: data,
            };
        } else {
            return {
                success: false,
                statusCode: status,
                message: data?.message || 'Request failed',
                errors: data?.errors || null,
            };
        }
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

    async initializeCsrf(): Promise<void> {
        await this.instance.get('/sanctum/csrf-cookie');
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
