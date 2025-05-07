"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, User, LogOut, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navigation() {
  const router = useRouter()
  const { isAuthenticated, userData, logout, hasRole } = useAuth()
  
  const handleLogout = () => {
    logout();
  }

  const isAdmin = hasRole('Admin');

  return (
    <header className="container mx-auto py-4 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center w-fit">
        <div className="relative h-10 w-20">
          <div className="absolute inset-0 bg-rose-500 rounded-full flex items-center justify-center">
            <Play className="h-5 w-5 text-white ml-1" />
          </div>
          <div
            className="absolute inset-0 border-2 border-rose-500 rounded-full"
            style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
          ></div>
        </div>
        <span className="text-rose-500 font-bold ml-2 text-sm">PURUS GAME</span>
      </Link>

      <nav className="hidden md:flex items-center space-x-2">
        <Link href="/">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Home
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            About
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Services
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Contact
          </Button>
        </Link>
        
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2 gap-2 rounded-full">
                <User className="h-4 w-4" />
                {userData?.UserName || "User"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full ml-2">
              Login
            </Button>
          </Link>
        )}
      </nav>

      {/* Mobile navigation */}
      <div className="flex md:hidden items-center">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 rounded-full">
                <User className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">About</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/services">Services</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">Contact</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}