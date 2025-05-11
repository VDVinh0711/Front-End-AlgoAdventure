"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const { toast } = useToast()

  // If already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    try {
      const result = await login(username, password)
      
      if (result.success) {
        toast({
          title: "✅ Đăng Nhập thành công!",
          description: "Đang chuyển hướng đến trang quản trị...",
          variant: "default",
          className: "bg-green-100 border-green-500 border",
        })
        
        // Router will handle the redirection based on the useEffect above
      } else if (result.error) {
        setError(result.error.message)
        toast({
          title: "❌ Đăng Nhập thất bại",
          description: result.error.message,
          variant: "destructive",
          className: "bg-red-100 border-red-500 border text-black",
          duration: 5000,
        })
      }
    } catch (err) {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.")
      toast({
        title: "❌ Lỗi",
        description: "Đã xảy ra lỗi. Vui lòng thử lại.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-black",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-4 px-4">
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
          <span className="text-rose-500 font-bold ml-2 text-sm">PURUS GAMES</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-rose-500">Chào Mừng Trở Lại!</h1>
                <p className="text-gray-600 mt-2">Đăng nhập để truy cập tài khoản của bạn</p>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg border border-red-200 text-sm">
                    {error}
                  </div>
                )}
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên Người Dùng</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nhập tên người dùng của bạn"
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mật Khẩu</Label>
                  
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    placeholder="" 
                    required 
                    className="rounded-lg" 
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full h-12"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng Nhập"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  Bằng cách tiếp tục, bạn đồng ý với{" "}
                  <Link href="#" className="text-rose-500 hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-rose-500 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <Button variant="ghost" className="text-rose-500 hover:bg-rose-100 rounded-full">
                Trở Về Trang Chủ
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
