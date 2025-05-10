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
  CAPDONGUOICHOIs: any[]
}

export default function LevelsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null)
  const [showJsonData, setShowJsonData] = useState<number | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        setIsLoading(true)
        const apiController = new ApiController()
        const data = await apiController.get<Level[]>('/CapDo')
        setLevels(data || [])
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

  // Filter levels based on search term
  const filteredLevels = levels.filter((level) => level.maCapDo.toString().includes(searchTerm))

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
      case 1:
        return "bg-white border border-gray-200"
      case 2:
        return "bg-rose-200"
      case 3:
        return "bg-yellow-200"
      case 4:
        return "bg-green-200"
      case 5:
        return "bg-red-200"
      case 6:
        return "bg-blue-200"
      default:
        return "bg-gray-200"
    }
  }

  // Render the level grid
  const renderLevelGrid = (levelData: LevelData) => {
    // Create a 6x6 grid
    const grid = Array(6)
      .fill(0)
      .map(() => Array(6).fill(null))

    // Fill the grid with block data
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
                {/* Player position indicator */}
                {isPlayerStart && <div className="absolute w-4 h-4 rounded-full bg-orange-500 z-10"></div>}

                {/* Coin indicator */}
                {block.IsHasCoin && <div className="absolute w-3 h-3 rounded-full bg-yellow-400 z-5"></div>}
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
              Back to Dashboard
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Manage Levels</h1>
              <p className="text-gray-600 mt-1">View and manage game levels</p>
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
                  Add New Level
                </Button>
              </Link>
            </div>
          </div>

          {/* Legend */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Block Type Legend</CardTitle>
              <CardDescription>Color coding for different block types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border border-gray-200"></div>
                  <span>Type 1 (White)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-rose-200"></div>
                  <span>Type 2 (Pink)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-200"></div>
                  <span>Type 3 (Yellow)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-200"></div>
                  <span>Type 4 (Green)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-200"></div>
                  <span>Type 5 (Red)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-200"></div>
                  <span>Type 6 (Blue)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border border-gray-200 relative flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                  <span>Player Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white border border-gray-200 relative flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  </div>
                  <span>Coin Position</span>
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
                  placeholder="Search by level ID..."
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
                      <TableHead className="w-[80px]">Level ID</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLevels.length > 0 ? (
                      filteredLevels.map((level) => {
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
                                  {level.maCapDo}
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
                                    <span className="ml-1">{showJson ? "Hide JSON" : "View JSON"}</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-rose-500 border-rose-500 hover:bg-rose-50"
                                    onClick={(e) => handleEditClick(level.maCapDo, e)}
                                  >
                                    Edit
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
                                        <h3 className="text-lg font-medium mb-2">Level {level.maCapDo} Grid</h3>
                                        {renderLevelGrid(levelData)}
                                        <div className="mt-2 text-sm text-gray-500">
                                          <p>Total Coins: {levelData.CoinInGame}</p>
                                          <p>
                                            Player Start: ({levelData.PointPlayerStart.x}, {levelData.PointPlayerStart.y})
                                          </p>
                                          <p>
                                            Direction: ({levelData.DirPlayerStart.x}, {levelData.DirPlayerStart.y})
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
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredLevels.length}</span> of{" "}
                    <span className="font-medium">{levels.length}</span> levels
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
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
