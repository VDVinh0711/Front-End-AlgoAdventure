"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Play, ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Player data from the image
const playerData = [
  { id: 1, maNguoiChoi: 14, soTien: 990, soKinhNghiem: 167, soGioY: 0, capDo: 15, diemSo: 900 },
  { id: 2, maNguoiChoi: 15, soTien: 957, soKinhNghiem: 140, soGioY: 0, capDo: 20, diemSo: 900 },
  { id: 3, maNguoiChoi: 16, soTien: 989, soKinhNghiem: 0, soGioY: 1, capDo: 0, diemSo: 0 },
  { id: 4, maNguoiChoi: 17, soTien: 1000, soKinhNghiem: 0, soGioY: 2, capDo: 0, diemSo: 0 },
  { id: 5, maNguoiChoi: 18, soTien: 1000, soKinhNghiem: 0, soGioY: 2, capDo: 0, diemSo: 0 },
  { id: 6, maNguoiChoi: 19, soTien: 1000, soKinhNghiem: 0, soGioY: 2, capDo: 0, diemSo: 0 },
  { id: 7, maNguoiChoi: 32, soTien: 990, soKinhNghiem: 140, soGioY: 0, capDo: 20, diemSo: 900 },
  { id: 8, maNguoiChoi: 33, soTien: 1000, soKinhNghiem: 0, soGioY: 2, capDo: 0, diemSo: 0 },
  { id: 9, maNguoiChoi: 37, soTien: 990, soKinhNghiem: 189, soGioY: 0, capDo: 33, diemSo: 2700 },
  { id: 10, maNguoiChoi: 38, soTien: 977, soKinhNghiem: 0, soGioY: 0, capDo: 1, diemSo: 0 },
  { id: 11, maNguoiChoi: 39, soTien: 959, soKinhNghiem: 0, soGioY: 0, capDo: 1, diemSo: 1800 },
  { id: 12, maNguoiChoi: 40, soTien: 990, soKinhNghiem: 0, soGioY: 0, capDo: 2, diemSo: 0 },
]

export default function EditPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const playerId = Number(params.id)

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [player, setPlayer] = useState({
    id: 0,
    maNguoiChoi: 0,
    soTien: 0,
    soKinhNghiem: 0,
    soGioY: 0,
    capDo: 0,
    diemSo: 0,
  })

  useEffect(() => {
    // Simulate API call to fetch player data
    setTimeout(() => {
      const foundPlayer = playerData.find((p) => p.id === playerId)
      if (foundPlayer) {
        setPlayer(foundPlayer)
      }
      setIsLoading(false)
    }, 500)
  }, [playerId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPlayer({
      ...player,
      [name]: Number(value),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call to update player
    setTimeout(() => {
      setIsSaving(false)
      router.push("/admin/players")
    }, 1000)
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
            <Link href="/admin/players" className="flex items-center text-rose-500 hover:text-rose-600">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Players
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-rose-500">Update Player</h1>
            <p className="text-gray-600 mt-1">Edit player information and statistics</p>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
                <CardHeader className="bg-rose-500 text-white">
                  <CardTitle>Player ID: {player.maNguoiChoi}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maNguoiChoi">maNguoiChoi</Label>
                      <Input
                        id="maNguoiChoi"
                        name="maNguoiChoi"
                        type="number"
                        value={player.maNguoiChoi}
                        onChange={handleInputChange}
                        className="rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="soTien">soTien</Label>
                      <Input
                        id="soTien"
                        name="soTien"
                        type="number"
                        value={player.soTien}
                        onChange={handleInputChange}
                        className="rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="soKinhNghiem">soKinhNghiem</Label>
                      <Input
                        id="soKinhNghiem"
                        name="soKinhNghiem"
                        type="number"
                        value={player.soKinhNghiem}
                        onChange={handleInputChange}
                        className="rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="soGioY">soGioY</Label>
                      <Input
                        id="soGioY"
                        name="soGioY"
                        type="number"
                        value={player.soGioY}
                        onChange={handleInputChange}
                        className="rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capDo">capDo</Label>
                      <Input
                        id="capDo"
                        name="capDo"
                        type="number"
                        value={player.capDo}
                        onChange={handleInputChange}
                        className="rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diemSo">diemSo</Label>
                      <Input
                        id="diemSo"
                        name="diemSo"
                        type="number"
                        value={player.diemSo}
                        onChange={handleInputChange}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </CardContent>

                <Separator />

                <CardFooter className="flex justify-between p-6">
                  <Link href="/admin/players">
                    <Button variant="outline" className="rounded-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="bg-rose-500 hover:bg-rose-600 text-white rounded-full"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
