"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, ArrowLeft, Plus, Search, Filter, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation" // Changed from next/router to next/navigation
import { ApiController } from "@/app/services/apiController"
import Navigation from "@/components/ui/navigation"
import { AchievementData, LoaiNhiemVuData, PhanThuongData } from "./types"

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter();
  const [data, setData] = useState<AchievementData[]>([]);
  const [loaiNhiemVus, setLoaiNhiemVus] = useState<LoaiNhiemVuData[]>([]);
  const [phanThuongs, setPhanThuongs] = useState<PhanThuongData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiController = new ApiController();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const apiController = new ApiController();
        
        // Fetch achievements data
        const achievementsPromise = apiController.get<AchievementData[]>('/NhiemVu');
        
        // Fetch LoaiNhiemVu data
        const loaiNhiemVuPromise = apiController.get<LoaiNhiemVuData[]>('/LoaiNhiemVu');
        
        // Fetch PhanThuong data
        const phanThuongPromise = apiController.get<PhanThuongData[]>('/PhanThuong');
        
        // Wait for all promises to resolve
        const [achievements, loaiNhiemVuData, phanThuongData] = await Promise.all([
          achievementsPromise, 
          loaiNhiemVuPromise,
          phanThuongPromise
        ]);
        
        setData(achievements || []);
        setLoaiNhiemVus(loaiNhiemVuData || []);
        setPhanThuongs(phanThuongData || []);
        
        setError(null);
      }
      catch(err) {
        console.error("Error fetching data:", err);
        setError("Lỗi khi tải dữ liệu nhiệm vụ và danh mục");
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchAllData();
  }, []);

  const handleUpdateClick = (maNhiemVu: number) => {
    if (!maNhiemVu) {
      console.error("IdAchienvement not valid");
      return;
    }
    router.push(`/admin/achievements/edit/${maNhiemVu}`);
  };

  const filteredAchievements = data.filter((skin) => {
    if (!searchTerm) return true;
    const nameMatch = skin.TenNhiemVu?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return nameMatch;
  });

  // Helper function to get LoaiNhiemVu name by ID
  const getLoaiNhiemVuName = (id: number) => {
    const loaiNhiemVu = loaiNhiemVus.find(item => item.MaLoaiNhiemVu === id);
    return loaiNhiemVu ? loaiNhiemVu.TenLoaiNhiemVu : `Loại ${id}`;
  };

  // Helper function to get PhanThuong name by ID
  const getPhanThuongName = (id: number) => {
    const phanThuong = phanThuongs.find(item => item.MaPhanThuong === id);
    return phanThuong ? phanThuong.TenPhanThuong : `Phần thưởng ${id}`;
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation/>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6">
            <Link href="/admin" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
               Quay Lại Trang Chủ
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Quản Lý Nhiệm Vụ</h1>
              <p className="text-gray-600 mt-1">Xem và cập nhật nhiệm vụ trong trò chơi</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full"
                onClick={() => router.push('/admin/achievements/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm Nhiệm Vụ Mới
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Tìm kiếm nhiệm vụ..."
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

          {/* Achievements Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">Đang tải nhiệm vụ...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Mã Nhiệm Vụ</TableHead>
                      <TableHead>Tên Nhiệm Vụ</TableHead>
                      <TableHead>Giá Trị Thưởng</TableHead>
                      <TableHead>Mốc Yêu Cầu</TableHead>
                      <TableHead>Loại Nhiệm Vụ</TableHead>
                      <TableHead>Loại Phần Thưởng</TableHead>
                      <TableHead className="text-right">Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAchievements.map((achievement) => (
                      <TableRow key={achievement.MaNhiemVu} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{achievement.MaNhiemVu}</TableCell> 
                        <TableCell>{achievement.MaNhiemVu}</TableCell>
                        <TableCell>{achievement.TenNhiemVu}</TableCell>
                        <TableCell>{achievement.GiaTriThuong}</TableCell>
                        <TableCell>{achievement.YeuCau}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs">
                            {getLoaiNhiemVuName(achievement.LoaiNhiemVu)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-green-50 text-green-800 rounded-full text-xs">
                            {getPhanThuongName(achievement.LoaiPhanThuong)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-500 border-rose-500 hover:bg-rose-50"
                            onClick={() => handleUpdateClick(achievement.MaNhiemVu || 0)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Cập Nhật
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredAchievements.length}</span> của{" "}
                <span className="font-medium">{filteredAchievements.length}</span> nhiệm vụ
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="rounded-full" disabled>
                  Trang Trước
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" disabled>
                  Trang Tiếp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}