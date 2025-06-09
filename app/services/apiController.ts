"use client";

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthController } from './AuthController';
import { BaseHttpClient } from './baseHttpClient';

export class ApiController extends BaseHttpClient
{
    private authController: AuthController;

    constructor(baseUrl: string = 'https://weevil-proud-definitely.ngrok-free.app/api') {
        super(baseUrl);
        this.authController = AuthController.getInstance(baseUrl);

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
            
            return await super.get<T>(endpoint, config);
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic POST method with authorization
    public async post<T>(endpoint: string, data: any): Promise<T> {
        try {
            return await super.post<T>(endpoint, data);
        } catch (error) {
            console.error(`Error posting data to ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic PUT method with authorization
    public async put<T>(endpoint: string, data: any): Promise<T> {
        try {
            return await super.put<T>(endpoint, data);
        } catch (error) {
            console.error(`Error updating data at ${endpoint}:`, error);
            throw error;
        }
    }

    // Generic DELETE method with authorization
    public async delete<T>(endpoint: string): Promise<T> {
        try {
            return await super.delete<T>(endpoint);
        } catch (error) {
            console.error(`Error deleting data at ${endpoint}:`, error);
            throw error;
        }
    }
}
