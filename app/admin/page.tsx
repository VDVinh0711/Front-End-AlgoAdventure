"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Award, Layers, Users, Palette } from "lucide-react"
import Navigation from "@/components/ui/navigation"
import { useAuth } from "@/app/contexts/AuthContext"

export default function AdminPage() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('Admin');

  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation/>
      {/* Admin Dashboard */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-rose-500 mb-2">Quản Lý Trò Chơi</h1>
            <p className="text-gray-600">Quản lý nội dung và người chơi trong trò chơi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Level Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Levels
                </CardTitle>
                <CardDescription className="text-rose-100">Quản lý cấp độ trong trò chơi</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Tạo, chỉnh sửa và sắp xếp cấp độ và cài đặt độ khó trong trò chơi.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/levels" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">Quản Lý Cấp Độ</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Achievement Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Nhiệm Vụ
                </CardTitle>
                <CardDescription className="text-rose-100">Quản lý nhiệm vụ trong trò chơi</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Tạo và cấu hình nhiệm vụ và phần thưởng cho người chơi trong trò chơi.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/achievements" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                    Quản Lý Nhiệm Vụ
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Skins Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Skins
                </CardTitle>
                <CardDescription className="text-rose-100">Quản lý bộ sưu tập trong trò chơi</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Tải lên và cấu hình bộ sưu tập nhân vật và tùy chỉnh hình ảnh trong trò chơi.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/skins" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">Quản Lý Bộ Sưu Tập</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Player Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Players
                </CardTitle>
                <CardDescription className="text-rose-100">Quản lý người chơi</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Xem thống kê người chơi, quản lý tài khoản và xử lý hỗ trợ.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/players" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                    Quản Lý Người Chơi
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Employee Management - only shown to Admin users */}
            {isAdmin && (
              <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
                <CardHeader className="bg-rose-500 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Employee
                  </CardTitle>
                  <CardDescription className="text-rose-100">Quản lý nhân viên</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600">Xem và quản lý tài khoản, vai trò và quyền hạn của nhân viên.</p>
                </CardContent>
                <CardFooter>
                  <Link href="/admin/employees" className="w-full">
                    <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                      Quản Lý Nhân Viên
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Thống Kê Nhanh</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Người Chơi Hoạt Động</p>
                <p className="text-3xl font-bold text-rose-500">12,458</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Tổng Trò Chơi</p>
                <p className="text-3xl font-bold text-rose-500">24</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Người Chơi Mới (24h)</p>
                <p className="text-3xl font-bold text-rose-500">342</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Yêu Cầu Hỗ Trợ</p>
                <p className="text-3xl font-bold text-rose-500">18</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
