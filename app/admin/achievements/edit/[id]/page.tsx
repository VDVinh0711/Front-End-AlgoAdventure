"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Play, ArrowLeft, Save, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ApiController } from "@/app/services/apiController"
import { AchievementData, LoaiNhiemVuData, PhanThuongData } from "../../types"
import Navigation from "@/components/ui/navigation"
import { useToast } from "@/hooks/use-toast"

export default function EditAchievementPage() {
  const router = useRouter()
  const params = useParams()
  const achievementId = Number.parseInt(params?.id as string || "0")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // State for achievement types and reward types
  const [achievementTypes, setAchievementTypes] = useState<LoaiNhiemVuData[]>([])
  const [rewardTypes, setRewardTypes] = useState<PhanThuongData[]>([])
  const [achievement, setAchievement] = useState<AchievementData>({
    MaNhiemVu: 0,
    TenNhiemVu: "",
    GiaTriThuong: 0,
    YeuCau: 0,
    LoaiNhiemVu: 1,
    LoaiPhanThuong: 1,
  })
  const { toast } = useToast()

  const apiController =  new ApiController();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all required data in parallel
        const achievementsPromise = apiController.get<AchievementData[]>('/NhiemVu');
        const loaiNhiemVuPromise = apiController.get<LoaiNhiemVuData[]>('/LoaiNhiemVu');
        const phanThuongPromise = apiController.get<PhanThuongData[]>('/PhanThuong');
        
        // Wait for all promises to resolve
        const [allAchievements, loaiNhiemVuData, phanThuongData] = await Promise.all([
          achievementsPromise,
          loaiNhiemVuPromise,
          phanThuongPromise
        ]);
        
        // Store the category data
        setAchievementTypes(loaiNhiemVuData || []);
        setRewardTypes(phanThuongData || []);
        
        // Find the specific achievement
        const foundAchievement = allAchievements.find(a => a.MaNhiemVu === achievementId);
        if (foundAchievement) {
          setAchievement(foundAchievement);
        } else {
          setError(`Không tìm thấy nhiệm vụ với ID ${achievementId}`);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu, vui lòng thử lại sau");
      } finally {
        setIsLoading(false);
      }
    };

    if (achievementId) {
      fetchAllData();
    }
  }, [achievementId]);

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
    setIsSaving(true)
    setError(null);
    try {
     await apiController.put<AchievementData>(`/NhiemVu/${achievementId}`, 
      {
        "TenNhiemVu": achievement.TenNhiemVu,
        "GiaTriThuong": achievement.GiaTriThuong,
        "YeuCau": achievement.YeuCau,
        "MaPhanThuong": achievement.LoaiPhanThuong,
        "MaLoaiNhiemVu": achievement.LoaiNhiemVu
      }
     );
     
     toast({
       title: "✅ Thành Công!",
       description: `Nhiệm Vụ "${achievement.TenNhiemVu}" đã được cập nhật thành công.`,
       variant: "default",
       className: "bg-green-100 border-green-500 border",
     });
     
     // Add a delay before redirecting to allow toast to be seen
     setTimeout(() => {
       router.push("/admin/achievements");
     }, 3000);
    } catch (err) {
      console.error("Error when update data Achievement", err);
      setError("Can't Update AchievmentData");
      
      toast({
        title: "❌ Cập Nhật Thất Bại",
        description: "Không thể cập nhật nhiệm vụ. Vui lòng kiểm tra kết nối và thử lại.",
        variant: "destructive",
        className: "bg-red-100 border-red-500 border text-black",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-rose-50">
        <Navigation/>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          <span className="ml-3 text-rose-500">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation/>
      
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
            <h1 className="text-3xl font-bold text-rose-500">Cập Nhật Nhiệm Vụ</h1>
            <p className="text-gray-600 mt-1">Chỉnh sửa chi tiết nhiệm vụ</p>
            {error && (
              <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                {error}
              </div>
            )}
          </div>

          {/* Edit Form */}
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
                        disabled
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
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="LoaiNhiemVu">maLoaiNhiemVu (Type)</Label>
                      <Select
                        value={(achievement.LoaiNhiemVu || 0 ).toString()}
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

              <CardFooter className="flex justify-end gap-4 p-6">
                <Link href={`/admin/achievements`}>
                  <Button variant="outline" type="button">
                    Hủy Bỏ
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></div>
                      Đang Lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Lưu Thay Đổi
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}
