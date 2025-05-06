"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Play, ArrowLeft, Save, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

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

export default function EditAchievementPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const achievementId = Number.parseInt(params.id)

  const [isLoading, setIsLoading] = useState(false)
  const [achievement, setAchievement] = useState({
    id: 0,
    maNhiemVu: "",
    tenNhiemVu: "",
    giaTri: 0,
    yeuCau: 0,
    maLoaiNhiemVu: 1,
    maPhanThuong: 1,
  })

  // Load achievement data
  useEffect(() => {
    const foundAchievement = achievementData.find((a) => a.id === achievementId)
    if (foundAchievement) {
      setAchievement(foundAchievement)
    }
  }, [achievementId])

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // In a real app, this would update the achievement in the database
      alert("Achievement updated successfully!")
      router.push("/admin/achievements")
    }, 1000)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false)
        // In a real app, this would delete the achievement from the database
        alert("Achievement deleted successfully!")
        router.push("/admin/achievements")
      }, 1000)
    }
  }

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
                        value={achievement.maNhiemVu}
                        onChange={handleInputChange}
                        className="rounded-lg"
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

              <CardFooter className="flex justify-between p-6">
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
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
