"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, ArrowLeft, Plus, Search, Filter, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Achievement data from the image
const achievementData = [
  { id: 1, maNhiemVu: "1", tenNhiemVu: "Kiếm 5 đồng", giaTri: 10, yeuCau: 5, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 2, maNhiemVu: "2", tenNhiemVu: "Kiếm 7 đồng", giaTri: 10, yeuCau: 7, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 3, maNhiemVu: "3", tenNhiemVu: "Kiếm 10 đồng", giaTri: 15, yeuCau: 10, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 4, maNhiemVu: "4", tenNhiemVu: "Kiếm 15 đồng", giaTri: 20, yeuCau: 15, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 5, maNhiemVu: "5", tenNhiemVu: "Kiếm 20 đồng", giaTri: 25, yeuCau: 20, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 6, maNhiemVu: "6", tenNhiemVu: "Kiếm 30 đồng", giaTri: 40, yeuCau: 30, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 7, maNhiemVu: "7", tenNhiemVu: "Kiếm 40 đồng", giaTri: 50, yeuCau: 40, maLoaiNhiemVu: 1, maPhanThuong: 2 },
  { id: 8, maNhiemVu: "8", tenNhiemVu: "Sử dụng 10 đồng", giaTri: 20, yeuCau: 10, maLoaiNhiemVu: 2, maPhanThuong: 2 },
  { id: 9, maNhiemVu: "9", tenNhiemVu: "Sử dụng 20 đồng", giaTri: 20, yeuCau: 20, maLoaiNhiemVu: 2, maPhanThuong: 2 },
  { id: 10, maNhiemVu: "10", tenNhiemVu: "Sử dụng 40 đồng", giaTri: 30, yeuCau: 40, maLoaiNhiemVu: 2, maPhanThuong: 2 },
  { id: 11, maNhiemVu: "11", tenNhiemVu: "Đạt cấp độ 2", giaTri: 2, yeuCau: 2, maLoaiNhiemVu: 3, maPhanThuong: 1 },
  { id: 12, maNhiemVu: "12", tenNhiemVu: "Đạt cấp độ 5", giaTri: 5, yeuCau: 5, maLoaiNhiemVu: 3, maPhanThuong: 1 },
  { id: 13, maNhiemVu: "13", tenNhiemVu: "Đạt cấp độ 7", giaTri: 5, yeuCau: 7, maLoaiNhiemVu: 3, maPhanThuong: 1 },
]

export default function AchievementsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter achievements based on search term
  const filteredAchievements = achievementData.filter((achievement) =>
    achievement.tenNhiemVu.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-20">
            <div className="absolute inset-0 bg-rose-500 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-white ml-1" />
            </div>
            <div
              className="absolute inset-0 border-2 border-rose-500 rounded-full"
              style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
            ></div>
          </div>
          <span className="text-rose-500 font-bold ml-2 text-sm">GAMETAMIN</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/">
            <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
              Home
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
              About
            </Button>
          </Link>
          <Link href="/games">
            <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
              Game
            </Button>
          </Link>
          <Link href="/recruit">
            <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
              Recruit
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="ghost" className="text-gray-700 hover:text-rose-500 rounded-full">
              Contact
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="default" className="bg-rose-500 hover:bg-rose-600 rounded-full">
              Admin
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full ml-2">
              Login
            </Button>
          </Link>
        </nav>

        <div className="flex md:hidden items-center space-x-2">
          <Link href="/login">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full">
              Login
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

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
              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>maNhiemVu</TableHead>
                    <TableHead>tenNhiemVu</TableHead>
                    <TableHead>giaTri</TableHead>
                    <TableHead>yeuCau</TableHead>
                    <TableHead>maLoaiNhiemVu</TableHead>
                    <TableHead>maPhanThuong</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAchievements.map((achievement) => (
                    <TableRow key={achievement.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{achievement.id}</TableCell>
                      <TableCell>{achievement.maNhiemVu}</TableCell>
                      <TableCell>{achievement.tenNhiemVu}</TableCell>
                      <TableCell>{achievement.giaTri}</TableCell>
                      <TableCell>{achievement.yeuCau}</TableCell>
                      <TableCell>{achievement.maLoaiNhiemVu}</TableCell>
                      <TableCell>{achievement.maPhanThuong}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/achievements/edit/${achievement.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-rose-500 border-rose-500 hover:bg-rose-50"
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Update
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to <span className="font-medium">13</span> of{" "}
                <span className="font-medium">13</span> achievements
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
