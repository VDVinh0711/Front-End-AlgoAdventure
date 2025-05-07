"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthController, AuthError } from '@/app/services/AuthController';

interface UserData {
    IDUser?: string;
    UserName?: string;
    RoleUse?: string[];
}

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userData: UserData | null;
    login: (username: string, password: string) => Promise<{ success: boolean, error?: AuthError }>;
    logout: () => void;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const router = useRouter();
    const authController = AuthController.getInstance();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsLoading(true);
                const authenticated = await authController.checkAuthStatus();
                setIsAuthenticated(authenticated);
                
                if (authenticated) {
                    const userData = await authController.fetchUserData();
                    setUserData(userData);
                }
            } catch (error) {
                console.error('Authentication check error:', error);
                setIsAuthenticated(false);
                setUserData(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const result = await authController.authenticate(username, password);
            
            if (result.success) {
                setIsAuthenticated(true);
                setUserData(authController.userData);
                
                // Debug user roles
                console.log("Login successful, user data:", authController.userData);
                console.log("Has Admin role:", authController.hasRole('Admin'));
                if (authController.userData?.RoleUse) {
                    console.log("User roles:", authController.userData.RoleUse);
                } else {
                    console.log("No roles found in user data");
                }
            }
            
            return result;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authController.logout();
        setIsAuthenticated(false);
        setUserData(null);
        router.push('/login');
    };

    const hasRole = (role: string) => {
        return authController.hasRole(role);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            isLoading, 
            userData, 
            login, 
            logout,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
}; 