"use client";

import type React from "react";
import ProtectedRoute from "../components/ProtectedRoute";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute requiredRoles={['Admin', 'Employee']}>
      {children}
    </ProtectedRoute>
  );
} 