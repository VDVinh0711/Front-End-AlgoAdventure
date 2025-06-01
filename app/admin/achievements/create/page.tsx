"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { LoaiNhiemVuData, PhanThuongData } from "../types"

export default function CreateAchievementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const { toast } = useToast()
  const apiController = new ApiController()
  
  // State for achievement types and reward types
  const [achievementTypes, setAchievementTypes] = useState<LoaiNhiemVuData[]>([])
  const [rewardTypes, setRewardTypes] = useState<PhanThuongData[]>([])
  const [error, setError] = useState<string | null>(null)
  
  const [achievement, setAchievement] = useState({
    MaNhiemVu: "",
    TenNhiemVu: "",
    GiaTriThuong: 0,
    YeuCau: 0,
    LoaiNhiemVu: 1,
    LoaiPhanThuong: 1,
  })

  // Fetch achievement types and reward types from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsInitialLoading(true)
        
        // Fetch LoaiNhiemVu data
        const loaiNhiemVuPromise = apiController.get<LoaiNhiemVuData[]>('/LoaiNhiemVu')
        
        // Fetch PhanThuong data
        const phanThuongPromise = apiController.get<PhanThuongData[]>('/PhanThuong')
        
        // Wait for all promises to resolve
        const [loaiNhiemVuData, phanThuongData] = await Promise.all([
          loaiNhiemVuPromise,
          phanThuongPromise
        ])
        
        setAchievementTypes(loaiNhiemVuData || [])
        setRewardTypes(phanThuongData || [])
        
        // Set default values if data is available
        if (loaiNhiemVuData?.length > 0 && phanThuongData?.length > 0) {
          setAchievement(prev => ({
            ...prev,
            LoaiNhiemVu: loaiNhiemVuData[0].MaLoaiNhiemVu,
            LoaiPhanThuong: phanThuongData[0].MaPhanThuong
          }))
        }
        
        setError(null)
      } catch (err) {
        console.error("Error fetching types data:", err)
        setError("Không thể tải dữ liệu loại nhiệm vụ và phần thưởng. Vui lòng thử lại sau.")
        // Set empty arrays as fallback
        setAchievementTypes([])
        setRewardTypes([])
      } finally {
        setIsInitialLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAchievement((prev) => ({
      ...prev,
      [name]: name === "GiaTriThuong" || name === "YeuCau" ? Number.parseInt(value) || 0 : value,
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
        "TenNhiemVu": achievement.TenNhiemVu,
        "GiaTriThuong": achievement.GiaTriThuong,
        "YeuCau": achievement.YeuCau,
        "MaPhanThuong": achievement.LoaiPhanThuong,
        "MaLoaiNhiemVu": achievement.LoaiNhiemVu
      });
      
      // Show success toast
      toast({
        title: "✅ Success!",
        description: `Achievement "${achievement.TenNhiemVu}" has been created successfully.`,
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

  // Show loading state
  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          <span className="ml-3 text-rose-500">Đang tải dữ liệu...</span>
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
            <Link href="/admin/achievements" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay Lại Trang Quản Lý Nhiệm Vụ
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Tạo Nhiệm Vụ Mới</h1>
            <p className="text-gray-600 mt-1">Thêm một nhiệm vụ mới vào trò chơi</p>
            {error && (
              <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Create Form */}
          <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="MaNhiemVu">maNhiemVu (ID)</Label>
                      <Input
                        id="MaNhiemVu"
                        name="MaNhiemVu"
                        value={achievement.MaNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="e.g. 14"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="TenNhiemVu">tenNhiemVu (Name)</Label>
                      <Input
                        id="TenNhiemVu"
                        name="TenNhiemVu"
                        value={achievement.TenNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="GiaTriThuong">giaTri (Value)</Label>
                      <Input
                        id="GiaTriThuong"
                        name="GiaTriThuong"
                        type="number"
                        value={achievement.GiaTriThuong}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="YeuCau">yeuCau (Requirement)</Label>
                      <Input
                        id="YeuCau"
                        name="YeuCau"
                        type="number"
                        value={achievement.YeuCau}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="LoaiNhiemVu">maLoaiNhiemVu (Type)</Label>
                      <Select
                        value={achievement.LoaiNhiemVu.toString()}
                        onValueChange={(value) => handleSelectChange("LoaiNhiemVu", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {achievementTypes.map((type) => (
                            <SelectItem key={type.MaLoaiNhiemVu} value={type.MaLoaiNhiemVu.toString()}>
                              {type.MaLoaiNhiemVu} - {type.TenLoaiNhiemVu}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="LoaiPhanThuong">maPhanThuong (Reward)</Label>
                      <Select
                        value={achievement.LoaiPhanThuong.toString()}
                        onValueChange={(value) => handleSelectChange("LoaiPhanThuong", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select reward" />
                        </SelectTrigger>
                        <SelectContent>
                          {rewardTypes.map((type) => (
                            <SelectItem key={type.MaPhanThuong} value={type.MaPhanThuong.toString()}>
                              {type.MaPhanThuong} - {type.TenPhanThuong}
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
