"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ApiController } from "@/app/services/apiController"
import Navigation from "@/components/ui/navigation"
import { useToast } from "@/hooks/use-toast"

interface SkinData {
  id?: number,
  maTrangPhuc?: string,
  tenTrangPhuc?: string,
  moTa?: string,
  giaTien?: number
}

export default function EditSkinPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  // Extract id safely to avoid the warning
  const skinId = params?.id || "";

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [skin, setSkin] = useState<SkinData>({
    id: 0,
    maTrangPhuc: "",
    tenTrangPhuc: "",
    moTa: "",
    giaTien: 0,
  })

  const apiController = new ApiController();

  useEffect(() => {
    const fetchSkinData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const allSkins = await apiController.get<SkinData[]>('/TrangPhuc');
        const foundSkin = allSkins.find(s => s.maTrangPhuc === skinId);
        if (foundSkin) {
          setSkin(foundSkin);
        } else {
          setError(`Not found skindata with id ${skinId}`);
        }
      } catch (err) {
        console.error("Error when fetch data:", err);
        setError("Can't load data, please try again");
      } finally {
        setIsLoading(false);
      }
    };

    if (skinId) {
      fetchSkinData();
    }
  }, [skinId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSkin((prev) => ({
      ...prev,
      [name]: name === "giaTien" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null);
    try {
      await apiController.put<SkinData>(`/TrangPhuc/${skinId}`, skin);
      
      // Show success toast
      toast({
        title: "✅ Thành công!",
        description: `Trang phục "${skin.tenTrangPhuc}" đã được cập nhật thành công.`,
        variant: "default",
        className: "bg-green-100 border-green-500 border",
      });
      
      // Add a delay before redirecting to allow toast to be seen
      setTimeout(() => {
        router.push("/admin/skins");
      }, 3000);
    } catch (err) {
      console.error("Error when update data skin", err);
      setError("Không thể cập nhật dữ liệu trang phục");
      
      // Show error toast
      toast({
        title: "❌ Cập nhật thất bại",
        description: "Không thể cập nhật trang phục. Vui lòng kiểm tra kết nối và thử lại.",
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
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
          <span className="ml-3 text-rose-500">Đang tải dữ liệu trang phục...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin/skins" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại Danh sách
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Cập nhật Trang Phục</h1>
            <p className="text-gray-600 mt-1">
              Chỉnh sửa thông tin trang phục: <span className="font-semibold">{skin.maTrangPhuc}</span> - {skin.tenTrangPhuc}
            </p>
            
            {error && (
              <div className="mt-2 text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-200">
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
                      <Label htmlFor="maTrangPhuc">Mã Trang Phục</Label>
                      <Input
                        id="maTrangPhuc"
                        name="maTrangPhuc"
                        value={skin.maTrangPhuc || ""}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="VD: TP001"
                        disabled 
                      />
                      <p className="text-xs text-gray-500">Mã trang phục không thể thay đổi</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tenTrangPhuc">Tên Trang Phục</Label>
                      <Input
                        id="tenTrangPhuc"
                        name="tenTrangPhuc"
                        value={skin.tenTrangPhuc || ""}
                        onChange={handleInputChange}
                        className="rounded-lg"
                        placeholder="VD: Gấu"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="moTa">Mô Tả</Label>
                    <Input
                      id="moTa"
                      name="moTa"
                      value={skin.moTa || ""}
                      onChange={handleInputChange}
                      className="rounded-lg"
                      placeholder="Nhập mô tả trang phục"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="giaTien">Giá Tiền</Label>
                    <Input
                      id="giaTien"
                      name="giaTien"
                      type="number"
                      value={skin.giaTien || 0}
                      onChange={handleInputChange}
                      className="rounded-lg"
                      min={0}
                    />
                  </div>
                </div>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-end p-6">
                <div className="flex gap-2">
                  <Link href="/admin/skins">
                    <Button variant="outline" disabled={isSaving}>
                      Hủy
                    </Button>
                  </Link>
                  <Button type="submit" className="bg-rose-500 hover:bg-rose-600" disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Đang lưu..." : "Lưu Thay Đổi"}
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
