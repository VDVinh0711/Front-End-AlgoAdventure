"use client";

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}; 