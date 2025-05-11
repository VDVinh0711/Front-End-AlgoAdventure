"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Play, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Navigation from "@/components/ui/navigation"
import { ApiController } from "@/app/services/apiController"

// Achievement types
const achievementTypes = [
  { id: 1, name: "Kiếm đồng" },
  { id: 2, name: "Sử dụng đồng" },
  { id: 3, name: "Đạt cấp độ" },
]

// Reward types
const rewardTypes = [
  { id: 1, name: "Cấp độ" },
  { id: 2, name: "Đồng" },
]

export default function CreateAchievementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const apiController = new ApiController()
  const [achievement, setAchievement] = useState({
    maNhiemVu: "",
    tenNhiemVu: "",
    giaTri: 0,
    yeuCau: 0,
    maLoaiNhiemVu: 1,
    maPhanThuong: 1,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAchievement((prev) => ({
      ...prev,
      [name]: name === "giaTri" || name === "yeuCau" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setAchievement((prev) => ({
      ...prev,
      [name]: Number.parseInt(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call the API to create the achievement
      await apiController.post('/NhiemVu', {
        "TenNhiemVu": achievement.tenNhiemVu,
        "GiaTriThuong": achievement.giaTri,
        "YeuCau": achievement.yeuCau,
        "MaPhanThuong": achievement.maPhanThuong,
        "MaLoaiNhiemVu": achievement.maLoaiNhiemVu
      });
      
      // Show success toast
      toast({
        title: "✅ Success!",
        description: `Achievement "${achievement.tenNhiemVu}" has been created successfully.`,
        variant: "default",
        className: "bg-green-100 border-green-500 border",
      });
      
      // Redirect after a delay
      setTimeout(() => {
        router.push("/admin/achievements");
      }, 3000);
    } catch (err) {
      console.error("Error creating achievement:", err);
      
      // Show error toast
      toast({
        title: "❌ Creation Failed",
        description: "Could not create achievement. Please check your connection and try again.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-black",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin/achievements" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay Lại Trang Quản Lý Nhiệm Vụ
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Tạo Nhiệm Vụ Mới</h1>
            <p className="text-gray-600 mt-1">Thêm một nhiệm vụ mới vào trò chơi</p>
          </div>

          {/* Create Form */}
          <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maNhiemVu">maNhiemVu (ID)</Label>
                      <Input
                        id="maNhiemVu"
                        name="maNhiemVu"
                        value={achievement.maNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="e.g. 14"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenNhiemVu">tenNhiemVu (Name)</Label>
                      <Input
                        id="tenNhiemVu"
                        name="tenNhiemVu"
                        value={achievement.tenNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="e.g. Kiếm 50 đồng"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="giaTri">giaTri (Value)</Label>
                      <Input
                        id="giaTri"
                        name="giaTri"
                        type="number"
                        value={achievement.giaTri}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="e.g. 50"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yeuCau">yeuCau (Requirement)</Label>
                      <Input
                        id="yeuCau"
                        name="yeuCau"
                        type="number"
                        value={achievement.yeuCau}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="e.g. 50"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maLoaiNhiemVu">maLoaiNhiemVu (Type)</Label>
                      <Select
                        value={achievement.maLoaiNhiemVu.toString()}
                        onValueChange={(value) => handleSelectChange("maLoaiNhiemVu", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {achievementTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.id} - {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maPhanThuong">maPhanThuong (Reward)</Label>
                      <Select
                        value={achievement.maPhanThuong.toString()}
                        onValueChange={(value) => handleSelectChange("maPhanThuong", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select reward" />
                        </SelectTrigger>
                        <SelectContent>
                          {rewardTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.id} - {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-end p-6">
                <div className="flex gap-2">
                  <Link href="/admin/achievements">
                    <Button variant="outline" disabled={isLoading}>
                      Hủy Bỏ
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Đang Tạo..." : "Tạo Nhiệm Vụ"}
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
