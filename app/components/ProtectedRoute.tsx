"use client";

import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

// Simple loading component
function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
    );
}

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRoles = [] }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, userData, hasRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            console.log("Not authenticated, redirecting to login");
            router.push('/login');
            return;
        }
        
        // If no roles required or not loading and authenticated, no need to check roles
        if (requiredRoles.length === 0 || isLoading) {
            return;
        }
        
        // Check if the user has the required roles
        if (isAuthenticated) {
            console.log("Required roles:", requiredRoles);
            console.log("User data:", userData);
            
            // Special handling for admin pages
            if (requiredRoles.includes('Admin') && userData?.RoleUse) {
                // Check if user has any role containing 'admin' (case insensitive)
                const hasAdminRole = userData.RoleUse.some(role => 
                    typeof role === 'string' && role.toLowerCase().includes('admin')
                );
                
                console.log("Has admin role (case-insensitive check):", hasAdminRole);
                
                if (hasAdminRole) {
                    console.log("User has admin privileges, allowing access");
                    return;
                }
            }
            
            const hasRequiredRole = requiredRoles.some(role => hasRole(role));
            
            if (!hasRequiredRole) {
                console.log("User doesn't have required roles, redirecting to unauthorized");
                router.push('/unauthorized');
            } else {
                console.log("User has required roles, allowing access");
            }
        }
    }, [isAuthenticated, isLoading, router, requiredRoles, hasRole, userData]);

    if (isLoading) {
        return <Loading />;
    }

    // Special case for admin pages - check for any admin-like role
    if (isAuthenticated && requiredRoles.includes('Admin') && userData?.RoleUse) {
        const hasAdminRole = userData.RoleUse.some(role => 
            typeof role === 'string' && role.toLowerCase().includes('admin')
        );
        
        if (hasAdminRole) {
            return <>{children}</>;
        }
    }

    // If user is authenticated and has required roles (or no roles required)
    if (isAuthenticated && (requiredRoles.length === 0 || requiredRoles.some(role => hasRole(role)))) {
        return <>{children}</>;
    }

    // This will show briefly before redirect happens
    return <Loading />;
} 