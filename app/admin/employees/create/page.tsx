"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Eye, EyeOff, User, Mail, Lock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiController } from "@/app/services/apiController"
import Navigation from "@/components/ui/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/app/contexts/AuthContext"

interface CreateEmployeeData {
  name: string
  email: string
  username: string
  password: string
}

export default function CreateEmployeePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { hasRole } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateEmployeeData>({
    name: "",
    email: "",
    username: "",
    password: "",
  })

  // Check if user has Admin role
  const isAdmin = hasRole('Admin')

  const apiController = new ApiController()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Tên nhân viên không được để trống")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email không được để trống")
      return false
    }
    if (!formData.username.trim()) {
      setError("Tài khoản không được để trống")
      return false
    }
    if (!formData.password.trim()) {
      setError("Mật khẩu không được để trống")
      return false
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      return false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Email không hợp lệ")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError(null)
    
    try {
              await apiController.post("NguoiDung/createEmployee", {
          TaiKhoan: formData.username,
          Email: formData.email,
          Ten: formData.name,
          MatKhau: formData.password,
        })
      
      toast({
        title: "✅ Thành công!",
        description: `Nhân viên "${formData.name}" đã được tạo thành công.`,
        variant: "default",
        className: "bg-green-100 border-green-500 border",
      })
      
      // Redirect back to employees list after a short delay
      setTimeout(() => {
        router.push("/admin/employees")
      }, 2000)
    } catch (err) {
      console.error("Error creating employee:", err)
      setError("Không thể tạo nhân viên. Vui lòng kiểm tra thông tin và thử lại.")
      
      // Show error toast
      toast({
        title: "❌ Tạo nhân viên thất bại",
        description: "Không thể tạo nhân viên. Vui lòng kiểm tra thông tin và thử lại.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-black",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If not admin, redirect or show access denied
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Không có quyền truy cập</h1>
                <p className="text-gray-600 mb-6">
                  Bạn không có quyền tạo nhân viên mới. Chức năng này chỉ dành cho quản trị viên.
                </p>
                <Link href="/admin">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    Quay lại Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin/employees" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại Danh sách Nhân viên
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Thêm Nhân Viên Mới</h1>
            <p className="text-gray-600 mt-1">
              Tạo tài khoản nhân viên mới cho hệ thống
            </p>
            
            {error && (
              <div className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}
          </div>

          {/* Create Form */}
          <Card className="bg-white shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center text-rose-500">
                <UserPlus className="h-5 w-5 mr-2" />
                Thông tin Nhân viên
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Tên Nhân viên
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="Nhập tên đầy đủ"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="example@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Tài khoản
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="Nhập tên tài khoản"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center">
                        <Lock className="h-4 w-4 mr-1" />
                        Mật khẩu
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleInputChange}
                          className="rounded-lg pr-10"
                          placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-end p-6">
                <div className="flex gap-3">
                  <Link href="/admin/employees">
                    <Button variant="outline" disabled={isLoading}>
                      Hủy
                    </Button>
                  </Link>
                  <Button 
                    type="submit" 
                    className="bg-rose-500 hover:bg-rose-600" 
                    disabled={isLoading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Đang tạo..." : "Tạo Nhân viên"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
} 