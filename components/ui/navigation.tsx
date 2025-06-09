"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
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
  
  // Debug logs removed - navigation should now show username correctly
  
  const handleLogout = () => {
    logout();
  }

  const isAdmin = hasRole('Admin');

  return (
    <header className="container mx-auto py-4 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center w-fit">
        <div className="relative h-32 w-32">
          <Image
            src="/images/games/logo/logo_company.png"
            alt="PURUS GAME Logo"
            width={500}
            height={500}
            className="object-contain"
          />
        </div>
      {/*  <span className="text-rose-500 font-bold ml-3 text-sm">PURUS GAME</span>   */}
      </Link>

      <nav className="hidden md:flex items-center space-x-2">
        <Link href="/">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Trang Chủ
          </Button>
        </Link>
        <Link href="/about">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Giới Thiệu
          </Button>
        </Link>
        <Link href="/services">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Dịch Vụ
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
            Liên Hệ
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
                  <Link href="/admin">Trang Quản Trị</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile">Tài Khoản Của Tôi</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng Xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full ml-2">
              Đăng Nhập
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
                <Link href="/">Trang Chủ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about">Giới Thiệu</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/services">Dịch Vụ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/contact">Liên Hệ</Link>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">Trang Quản Trị</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/profile">Tài Khoản Của Tôi</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="h-4 w-4 mr-2" />
                Đăng Xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full">
              Đăng Nhập
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}