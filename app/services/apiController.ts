"use client";

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthController } from './AuthController';
import { SafeKeyLocalStorage } from './Ultils/safeKeyLocalStorage';

export class ApiController
{
    private readonly baseUrl: string;
    private axiosInstance: AxiosInstance;
    private authController: AuthController;

    constructor(baseUrl: string = 'https://192.168.11.1:5001/api') {
        this.baseUrl = baseUrl;
        this.authController = AuthController.getInstance(baseUrl);
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });

        // Add request interceptor to check token before each request
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                const token = this.authController.getToken();
                
                if (token) {
                    // Add token to request headers
                    config.headers['Authorization'] = `Bearer ${token}`;
                } else {
                    // Try to refresh token if not available
                    const isAuthenticated = await this.authController.checkAuthStatus();
                    if (isAuthenticated) {
                        const newToken = this.authController.getToken();
                        if (newToken) {
                            config.headers['Authorization'] = `Bearer ${newToken}`;
                        }
                    } else {
                        // We'll handle this in the response interceptor
                        // for better UX rather than redirecting here
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor to handle token expiration
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;
                
                // Handle 401 Unauthorized errors (expired token)
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    
                    // Try to refresh the token
                    const isRefreshed = await this.authController.refreshAuthToken();
                    
                    if (isRefreshed) {
                        const newToken = this.authController.getToken();
                        if (newToken) {
                            // Update authorization header
                            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                            
                            // Retry the original request
                            return this.axiosInstance(originalRequest);
                        }
                    } else {
                        // If token refresh failed, redirect to login
                        this.authController.logout();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }
                }
                
                return Promise.reject(error);
            }
        );
    }

    // Generic GET method with authorization
    public async get<T>(endpoint: string, params?: any): Promise<T> {
        try {
            const config: AxiosRequestConfig = {};
            if (params) {
                config.params = params;
            }
            
            const response: AxiosResponse<T> = await this.axiosInstance.get(endpoint, config);
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic POST method with authorization
    public async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`Error posting data to ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic PUT method with authorization
    public async put<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.put(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating data at ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic DELETE method with authorization
    public async delete<T>(endpoint: string): Promise<T> {
        try {
            const response: AxiosResponse<T> = await this.axiosInstance.delete(endpoint);
            return response.data;
        } catch (error) {
            console.error(`Error deleting data at ${endpoint}:`, error);
            throw error;
        }
    }
}
