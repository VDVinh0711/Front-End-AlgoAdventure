"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Play, ArrowLeft, Plus, Search, Filter, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/ui/navigation"
import { ApiController } from "@/app/services/apiController"

// Define the types for our level data
interface Point {
  x: number
  y: number
}

interface BlockData {
  BlockType: number
  IsHasCoin: boolean
  PointMap: Point
}

interface LevelData {
  DirPlayerStart: Point
  PointPlayerStart: Point
  ListDataMap: BlockData[]
  CoinInGame: number
}

interface Level {
  maCapDo: number
  duLieuCapDo: string
  thoiGianCapNhat: string
}

export default function LevelsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null)
  const [showJsonData, setShowJsonData] = useState<number | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const levelsPerPage = 5
  
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setIsLoading(true)
        const apiController = new ApiController()
        const response = await apiController.get<any>('/CapDo')
        
        console.log("API Response:", response)
        console.log("Response type:", typeof response)
        console.log("Is array:", Array.isArray(response))
        
        // Handle different response formats
        let levelsData: Level[] = []
        if (Array.isArray(response)) {
          levelsData = response
        } else if (response && typeof response === 'object') {
          // Check if the response has a property containing the array
          const possibleArrayKeys = ['data', 'levels', 'capDo', 'result', 'items']
          for (const key of possibleArrayKeys) {
            if (response[key] && Array.isArray(response[key])) {
              levelsData = response[key]
              break
            }
          }
          // If no array found in nested properties, log the structure
          if (levelsData.length === 0) {
            console.log("Response keys:", Object.keys(response))
          }
        }
        
        console.log("Processed levels data:", levelsData)
        setLevels(levelsData)
        setError(null)
      } catch (err) {
        console.error("Error fetching levels:", err)
        setError(err instanceof Error ? err.message : 'An error occurred when fetching levels')
        setLevels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLevels()
  }, [])

  const filteredLevels = Array.isArray(levels) ? levels.filter((level) => level.maCapDo.toString().includes(searchTerm)) : []
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredLevels.length / levelsPerPage)
  
  // Get current levels for the page
  const indexOfLastLevel = currentPage * levelsPerPage
  const indexOfFirstLevel = indexOfLastLevel - levelsPerPage
  const currentLevels = filteredLevels.slice(indexOfFirstLevel, indexOfLastLevel)
  
  // Handle page changes
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      // Reset expanded level when changing pages
      setExpandedLevel(null)
      setShowJsonData(null)
    }
  }
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      // Reset expanded level when changing pages
      setExpandedLevel(null)
      setShowJsonData(null)
    }
  }

  // Toggle expanded level
  const toggleExpandLevel = (levelId: number) => {
    if (expandedLevel === levelId) {
      setExpandedLevel(null)
    } else {
      setExpandedLevel(levelId)
    }
  }

  // Toggle JSON data visibility
  const toggleJsonData = (levelId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the row from expanding/collapsing
    if (showJsonData === levelId) {
      setShowJsonData(null)
    } else {
      setShowJsonData(levelId)
    }
  }

  // Get block color based on block type
  const getBlockColor = (blockType: number) => {
    switch (blockType) {
      case 0:
        return "bg-pink-200"
      case 1:
        return "bg-white border border-gray-200"
      case 2:
        return "bg-green-400"
      case 3:
        return "bg-red-400"
      case 4:
        return "bg-blue-400"
      default:
        return "bg-gray-400"
    }
  }

  // Render the level grid
  const renderLevelGrid = (levelData: LevelData) => {
    // Create a 6x6 grid
    const grid = Array(6)
      .fill(0)
      .map(() => Array(6).fill(null))

    levelData.ListDataMap.forEach((block) => {
      const { x, y } = block.PointMap
      grid[y][x] = block
    })

    return (
      <div className="grid grid-cols-6 gap-1 w-full max-w-md mx-auto my-4">
        {grid.map((row, rowIndex) =>
          row.map((block, colIndex) => {
            if (!block) return <div key={`${rowIndex}-${colIndex}`} className="aspect-square bg-gray-100"></div>

            const isPlayerStart = levelData.PointPlayerStart.x === colIndex && levelData.PointPlayerStart.y === rowIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`aspect-square ${getBlockColor(block.BlockType)} relative flex items-center justify-center`}
              >
                {isPlayerStart && <div className="absolute w-4 h-4 rounded-full bg-orange-500 z-10"></div>}

                {block.IsHasCoin && <div className="absolute w-3 h-3 rounded-full bg-yellow-500 z-5"></div>}
              </div>
            )
          }),
        )}
      </div>
    )
  }

  // Handle edit button click
  const handleEditClick = (levelId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row from expanding
    router.push(`/admin/levels/edit/${levelId}`);
  };

  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
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
              <h1 className="text-3xl font-bold text-rose-500">Quản Lý Màn Chơi</h1>
              <p className="text-gray-600 mt-1">Xem và quản lý màn chơi trong trò chơi</p>
              {error && (
                <div className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-md">
                  {error}
                </div>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/admin/levels/create">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm Màn Chơi Mới
                </Button>
              </Link>
            </div>
          </div>

          {/* Legend */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Mô Tả Các Khối</CardTitle>
              <CardDescription>Mã Màu Cho Các Khối</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-pink-200"></div>
                  <span>Khối Bình Thường (Màu Hồng)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border border-gray-200"></div>
                  <span>Khối Rỗng (Màu Trắng)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-400"></div>
                  <span>Khối Trang Trí (Màu Xanh)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-400"></div>
                  <span>Khối Bẫy (Màu Đỏ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-400"></div>
                  <span>Khối Địa Hình Cao Thấp (Màu Xanh Dương)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border border-gray-200 relative flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                  <span>Vị Trí Player</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border border-gray-200 relative flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  </div>
                  <span>Vị Trí Tiền</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Tìm kiếm theo số màn..."
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
          )}

          {/* Levels Table */}
          {!isLoading && !error && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px]">Màn</TableHead>
                      <TableHead>Thời Gian Cập Nhật</TableHead>
                      <TableHead className="text-right">Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentLevels.length > 0 ? (
                      currentLevels.map((level) => {
                        const levelData: LevelData = JSON.parse(level.duLieuCapDo)
                        const isExpanded = expandedLevel === level.maCapDo
                        const showJson = showJsonData === level.maCapDo

                        return (
                          <React.Fragment key={level.maCapDo}>
                            <TableRow
                              className="hover:bg-gray-50 cursor-pointer"
                              onClick={() => toggleExpandLevel(level.maCapDo)}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center">
                                  {isExpanded ? (
                                    <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                                  ) : (
                                    <ChevronUp className="h-4 w-4 mr-2 text-gray-500" />
                                  )}
                                  {level.maCapDo + 1}
                                </div>
                              </TableCell>
                              <TableCell>{new Date(level.thoiGianCapNhat).toLocaleString()}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-500"
                                    onClick={(e) => toggleJsonData(level.maCapDo, e)}
                                  >
                                    {showJson ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="ml-1">{showJson ? "Ẩn JSON" : "Hiển Thị JSON"}</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-rose-500 border-rose-500 hover:bg-rose-50"
                                    onClick={(e) => handleEditClick(level.maCapDo, e)}
                                  >
                                    Cập Nhật
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>

                            {/* Expanded level view */}
                            {isExpanded && (
                              <TableRow>
                                <TableCell colSpan={3} className="p-0 border-t-0">
                                  <div className="bg-gray-50 p-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                      <div className="flex-1">
                                        <h3 className="text-lg font-medium mb-2">Màn {level.maCapDo + 1} Grid</h3>
                                        {renderLevelGrid(levelData)}
                                        <div className="mt-2 text-sm text-gray-500">
                                          <p>Total Coins: {levelData.CoinInGame}</p>
                                          <p>
                                            Vị Trí Player: ({levelData.PointPlayerStart.x}, {levelData.PointPlayerStart.y})
                                          </p>
                                          <p>
                                            Hướng Di Chuyển: ({levelData.DirPlayerStart.x}, {levelData.DirPlayerStart.y})
                                          </p>
                                        </div>
                                      </div>

                                      {showJson && (
                                        <div className="flex-1">
                                          <h3 className="text-lg font-medium mb-2">Level JSON Data</h3>
                                          <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
                                            <pre className="text-xs whitespace-pre-wrap">
                                              {JSON.stringify(levelData, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </React.Fragment>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          {searchTerm ? "No levels found matching your search" : "No level data available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredLevels.length > 0 && (
                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="text-sm text-gray-500">
                    Hiển thị <span className="font-medium">{indexOfFirstLevel + 1}</span> đến{" "}
                    <span className="font-medium">{Math.min(indexOfLastLevel, filteredLevels.length)}</span> của{" "}
                    <span className="font-medium">{filteredLevels.length}</span> màn chơi
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full" 
                      disabled={currentPage === 1}
                      onClick={handlePreviousPage}
                    >
                      Trang Trước
                    </Button>
                    <span className="flex items-center px-3 py-1 text-sm">
                      Trang {currentPage} trên {totalPages}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="rounded-full" 
                      disabled={currentPage === totalPages}
                      onClick={handleNextPage}
                    >
                      Trang Tiếp
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
