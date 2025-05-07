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

export interface AchievementData {
    MaNhiemVu?: number,
    TenNhiemVu: string,
    GiaTriThuong: number,
    YeuCau: number,
    LoaiNhiemVu: number,
    LoaiPhanThuong: number
}

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter();
  const [data, setData] = useState<AchievementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiController = new ApiController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const apiController = new ApiController();
        const result = await apiController.get<AchievementData[]>('/NhiemVu');
        console.log(result);
        setData(result || []);
        setError(null);
      }
      catch(err) {
        setError("Error when try fetch data Achievemnts");
      }
      finally {
        setIsLoading(false);
      }
    }
    fetchData();
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
              Back to Dashboard
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Manage Achievements</h1>
              <p className="text-gray-600 mt-1">View and update game achievements</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                className="bg-rose-500 hover:bg-rose-600 text-white rounded-full"
                onClick={() => router.push('/admin/achievements/create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Achievement
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search achievements..."
                  className="pl-10 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="rounded-full">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Achievements Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">Loading achievements...</div>
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
                      <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell>{achievement.LoaiNhiemVu}</TableCell>
                        <TableCell>{achievement.LoaiPhanThuong}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-500 border-rose-500 hover:bg-rose-50"
                            onClick={() => handleUpdateClick(achievement.MaNhiemVu || 0)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Update
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAchievements.length}</span> of{" "}
                <span className="font-medium">{filteredAchievements.length}</span> achievements
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="rounded-full" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="rounded-full" disabled>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}