"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Search, Filter, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ApiController } from "@/app/services/apiController"
import Navigation from "@/components/ui/navigation"
import axios, { AxiosResponse } from "axios"

interface SkinData {
  id?: number,
  maTrangPhuc?: string,
  tenTrangPhuc?: string,
  moTa?: string,
  giaTien?: number
}

export default function SkinsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")
  const [data, setData] = useState<SkinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiController = new ApiController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiController = new ApiController();
        const result = await apiController.get<SkinData[]>('/TrangPhuc');
        console.log(result);
        setData(result || []);
        setError(null);
      }
      catch (err) {
        console.error("Không thể tải dữ liệu trang phục:", err);
        setError("Không thể tải dữ liệu từ máy chủ. Vui lòng thử lại sau.");
        setData([
          { id: 1, maTrangPhuc: "TP001", tenTrangPhuc: "Gấu", moTa: "Trang Phục Gấu", giaTien: 0 },
          { id: 2, maTrangPhuc: "TP002", tenTrangPhuc: "Chim", moTa: "Trang Phục Chim", giaTien: 10 },
          { id: 3, maTrangPhuc: "TP003", tenTrangPhuc: "Thỏ", moTa: "Trang Phục Thỏ", giaTien: 12 },
        ]);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = (maTrangPhuc: string) => {
    if (!maTrangPhuc) {
      console.error("Mã trang phục không hợp lệ");
      return;
    }

    router.push(`/admin/skins/edit/${maTrangPhuc}`);
  };

  const filteredSkins = data.filter((skin) => {
    if (!searchTerm) return true;
    
    const nameMatch = skin.tenTrangPhuc?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const codeMatch = skin.maTrangPhuc?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return nameMatch || codeMatch;
  });

  // Show loading state
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
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Quay lại Trang Chủ
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Quản lý Trang Phục</h1>
              <p className="text-gray-600 mt-1">Xem và cập nhật trang phục nhân vật</p>
              {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}
            </div>
            {/* <div className="mt-4 md:mt-0">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Thêm Trang Phục Mới
              </Button>
            </div> */}
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Tìm kiếm trang phục..."
                  className="pl-10 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Lọc
              </Button>
            </div>
          </div>

          {/* Skins Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Mã Trang Phục</TableHead>
                    <TableHead>Tên Trang Phục</TableHead>
                    <TableHead>Mô Tả</TableHead>
                    <TableHead>Giá Tiền</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSkins.length > 0 ? (
                    filteredSkins.map((skin, index) => (
                      <TableRow key={skin.maTrangPhuc} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell className="font-medium">{skin.maTrangPhuc || "N/A"}</TableCell>
                        <TableCell>{skin.tenTrangPhuc || "N/A"}</TableCell>
                        <TableCell>{skin.moTa || "Không có mô tả"}</TableCell>
                        <TableCell>{skin.giaTien !== undefined ? `${skin.giaTien}` : "N/A"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-500 border-rose-500 hover:bg-rose-50"
                            onClick={() => handleUpdateClick(skin.maTrangPhuc || "")}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Cập nhật
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {searchTerm ? "Không tìm thấy trang phục phù hợp" : "Chưa có dữ liệu trang phục"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredSkins.length}</span> của{" "}
                <span className="font-medium">{data.length}</span> trang phục
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="rounded-full" disabled>
                  Trước
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" disabled>
                  Sau
                </Button>
              </div>
            </div>
          </div>
          
          {/* Management Button - Added to match the image */}
          <div className="mt-6 flex justify-center">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full">
              Quản Lý Bộ Sưu Tập
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
