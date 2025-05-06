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
import { AchievementData } from "../../page"
import Navigation from "@/components/ui/navigation"
import { useToast } from "@/components/ui/use-toast"

// Achievement types
const achievementTypes = [
  { id: 1, name: "Sử Dụng Tiền" },
  { id: 2, name: "Tiết Kiệm Tiền" },
  { id: 3, name: "Mở Khóa Cấp Độ" },
]

// Reward types
const rewardTypes = [
  { id: 1, name: "Tiền" },
  { id: 2, name: "Kinh Nghiệm" },
]

export default function EditAchievementPage() {
  const router = useRouter()
  const params = useParams()
  const achievementId = Number.parseInt(params.id as string)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
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
    const fetchSkinData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allAchievements = await apiController.get<AchievementData[]>('/NhiemVu');
        const foundSkin = allAchievements.find(a => a.MaNhiemVu === achievementId);
        if (foundSkin) {
          setAchievement(foundSkin);
        } else {
          setError(`Not found Achievemetns Data with id ${achievementId}`);
        }
      } catch (err) {
        console.error("Eror when fetch data :", err);
        setError("Can't load data , please try again");
      } finally {
        setIsLoading(false);
      }
    };

    if (achievementId) {
      fetchSkinData();
    }
  }, [achievementId]);

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
      [name === "maLoaiNhiemVu" ? "LoaiNhiemVu" : name === "maPhanThuong" ? "LoaiPhanThuong" : name]: Number.parseInt(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null);
    try {
      // console.log("Achievement Data:", achievement.LoaiNhiemVu);
      // console.log("Achievement Data:", achievement.LoaiPhanThuong);
     await apiController.put<AchievementData>(`/NhiemVu/${achievementId}`, 
      {
        "TenNhiemVu": achievement.TenNhiemVu,
        "GiaTriThuong": achievement.GiaTriThuong,
        "YeuCau": achievement.YeuCau,
        "MaPhanThuong": achievement.LoaiPhanThuong,
        "MaLoaiNhiemVu": achievement.LoaiNhiemVu
      }
     );
     
     alert("Achievement updated successfully");
     router.push("/admin/achievements");
     toast({
       title: "Success!",
       description: `Achievement "${achievement.TenNhiemVu}" has been updated successfully.`,
       variant: "default",
       duration: 3000,
     });
     
     // Add a delay before redirecting to allow toast to be seen
     setTimeout(() => {
       router.push("/admin/achievements");
     }, 1500);
    } catch (err) {
      console.error("Error when update data Achievement", err);
      setError("Can't Update AchievmentData");
      
      toast({
        title: "Error!",
        description: "Failed to update achievement. Please try again.",
        variant: "destructive",
        duration: 3000,
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
          <span className="ml-3 text-rose-500">Đang tải dữ liệu trang phục...</span>
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
              Back to Achievements
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Update Achievement</h1>
            <p className="text-gray-600 mt-1">Edit achievement details</p>
          </div>

          {/* Edit Form */}
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
                        value={achievement.MaNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenNhiemVu">tenNhiemVu (Name)</Label>
                      <Input
                        id="tenNhiemVu"
                        name="tenNhiemVu"
                        value={achievement.TenNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
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
                        value={achievement.GiaTriThuong}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yeuCau">yeuCau (Requirement)</Label>
                      <Input
                        id="yeuCau"
                        name="yeuCau"
                        type="number"
                        value={achievement.YeuCau}
                        onChange={handleInputChange}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maLoaiNhiemVu">maLoaiNhiemVu (Type)</Label>
                      <Select
                        value={(achievement.LoaiNhiemVu || 0 ).toString()}
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
                        value={achievement.LoaiPhanThuong.toString()}
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

              <CardFooter className="flex justify-between p-6">
                <div className="border-red-500 text-red-500 hover:bg-red-50"> </div>
                <div className="flex gap-2">
                  <Link href="/admin/achievements">
                    <Button variant="outline" disabled={isLoading}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isLoading}>
                    <Save className="h-4 w-4 mr-2" />
                    {isLoading ? "Saving..." : "Save Changes"}
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
