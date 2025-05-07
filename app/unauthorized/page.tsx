"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center text-center p-4">
      <ShieldAlert className="h-20 w-20 text-rose-500 mb-6" />
      
      <h1 className="text-4xl font-bold text-rose-500 mb-4">Access Denied</h1>
      
      <p className="text-lg text-gray-700 max-w-md mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </p>
      
      <div className="flex gap-4">
        <Link href="/">
          <Button variant="outline" className="rounded-full">
            Go Home
          </Button>
        </Link>
        
        <Link href="/login">
          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
            Login with Different Account
          </Button>
        </Link>
      </div>
    </div>
  );
} 