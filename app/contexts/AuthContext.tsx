"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthController, AuthError } from '@/app/services/AuthController';

interface UserData {
    IDUser?: string;
    UserName?: string;
    RoleUsers?: string[] | string;
    maNguoiDung?: string;
    taiKhoan?: string;
    email?: string;
    ten?: string;
    phuongThucDangNhap?: string;
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
    const [authController, setAuthController] = useState<AuthController | null>(null);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    // Check if we're on the client side
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            setAuthController(AuthController.getInstance());
        }
    }, []);

    useEffect(() => {
        // Only proceed if we're on the client and have an auth controller
        if (!isClient || !authController) {
            setIsLoading(false);
            return;
        }
        
        const checkAuthStatus = async () => {
            try {
                setIsLoading(true);
                const authenticated = await authController.checkAuthStatus();
                setIsAuthenticated(authenticated);
                
                if (authenticated) {
                    const fetchedUserData = await authController.fetchUserData();
                    if (fetchedUserData) {
                        // Map the data from AuthController to our UserData interface
                        setUserData({
                            IDUser: fetchedUserData.maNguoiDung,
                            UserName: fetchedUserData.ten || fetchedUserData.taiKhoan, // Use 'ten' as UserName, fallback to 'taiKhoan'
                            RoleUsers: fetchedUserData.RoleUsers,
                            maNguoiDung: fetchedUserData.maNguoiDung,
                            taiKhoan: fetchedUserData.taiKhoan,
                            email: fetchedUserData.email,
                            ten: fetchedUserData.ten,
                            phuongThucDangNhap: fetchedUserData.phuongThucDangNhap
                        });
                    }
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
    }, [authController, isClient]);

    const login = async (username: string, password: string) => {
        if (!authController) return { success: false, error: { message: 'Auth not initialized' } };
        
        setIsLoading(true);
        try {
            const result = await authController.authenticate(username, password);
            
            if (result.success) {
                setIsAuthenticated(true);
                
                // Map the data from AuthController to our UserData interface
                const authUserData = authController.userData;
                if (authUserData) {
                    setUserData({
                        IDUser: authUserData.maNguoiDung,
                        UserName: authUserData.ten || authUserData.taiKhoan, // Use 'ten' as UserName, fallback to 'taiKhoan'
                        RoleUsers: authUserData.RoleUsers,
                        maNguoiDung: authUserData.maNguoiDung,
                        taiKhoan: authUserData.taiKhoan,
                        email: authUserData.email,
                        ten: authUserData.ten,
                        phuongThucDangNhap: authUserData.phuongThucDangNhap
                    });
                }
                
                // Debug user roles
                console.log("Login successful, user data:", authUserData);
                console.log("Has Admin role:", authController.hasRole('Admin'));
                if (authUserData?.RoleUsers) {
                    console.log("User roles:", authUserData.RoleUsers);
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
        if (!authController) return;
        
        authController.logout();
        setIsAuthenticated(false);
        setUserData(null);
        router.push('/login');
    };

    const hasRole = (role: string) => {
        if (!authController) return false;
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