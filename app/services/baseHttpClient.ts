import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class BaseHttpClient {
    protected axiosInstance: AxiosInstance;

    constructor(baseUrl: string = 'https://weevil-proud-definitely.ngrok-free.app/api') {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'ngrok-skip-browser-warning': 'true'
            }
        });
    }

    protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.get(endpoint, config);
        return response.data;
    }

    protected async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.post(endpoint, data, config);
        return response.data;
    }

    protected async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.put(endpoint, data, config);
        return response.data;
    }

    protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.axiosInstance.delete(endpoint, config);
        return response.data;
    }
} 