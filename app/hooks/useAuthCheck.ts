"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthController } from '../services/AuthController';

export const useAuthCheck = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const authController = AuthController.getInstance();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("Run auth Check");
                const isAuthenticated = await authController.checkAuthStatus();
                console.log(isAuthenticated);
                if (isAuthenticated) {
                    router.push('/admin'); 
                } else {
                    router.push('/'); 
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    return { isLoading };
}; 