"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, ArrowLeft, Plus, Search, Filter, BarChart2, PieChart, LineChart as LucideLineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BarChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  LineChart,
} from "recharts"
import Navigation from "@/components/ui/navigation"
import { ApiController } from "@/app/services/apiController"

// Define the player interface to match API response
interface Player {
  maNguoiChoi: number
  soTien: number
  soKinhNghiem: number
  soGoiY: number
  capDo: number
  diemSo: number
}

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState<Player[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<"score" | "level" | "money">("score")
  const [visualizationType, setVisualizationType] = useState<"bar" | "line" | "pie">("pie")
  const [error, setError] = useState<string | null>(null)

  // Fetch players data from API
  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const apiController = new ApiController()
        const data = await apiController.get<Player[]>('/NguoiChoi')
        
        console.log("Players API Response:", data)
        console.log("Response type:", typeof data)
        console.log("Is array:", Array.isArray(data))
        
        // Handle different response formats
        let playersData: Player[] = []
        if (Array.isArray(data)) {
          playersData = data
        } else if (data && typeof data === 'object') {
          // Check if the response has a property containing the array
          const possibleArrayKeys = ['data', 'players', 'nguoiChoi', 'result', 'items']
          for (const key of possibleArrayKeys) {
            if ((data as any)[key] && Array.isArray((data as any)[key])) {
              playersData = (data as any)[key]
              break
            }
          }
          // If no array found in nested properties, log the structure
          if (playersData.length === 0) {
            console.log("Response keys:", Object.keys(data))
          }
        }
        
        console.log("Processed players data:", playersData)
        setPlayers(playersData)
      } catch (error) {
        console.error('Error fetching player data:', error)
        setError(`Error connecting to API: ${error instanceof Error ? error.message : String(error)}`)
        // Set empty array to avoid undefined errors
        setPlayers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  // Filter players based on search term
  const filteredPlayers = Array.isArray(players) ? players.filter((player) => 
    player.maNguoiChoi.toString().includes(searchTerm)
  ) : []

  useEffect(() => {
    if (players.length > 0) {
      prepareChartData()
    }
  }, [chartType, players])

  const prepareChartData = () => {
    let data: any[] = []

    if (chartType === "score") {
      // Group players by score ranges
      const scoreRanges = [
        { min: 0, max: 0, label: "0" },
        { min: 1, max: 500, label: "1-500" },
        { min: 501, max: 1000, label: "501-1000" },
        { min: 1001, max: 2000, label: "1001-2000" },
        { min: 2001, max: 3000, label: "2001-3000" },
      ]

      data = scoreRanges.map((range) => {
        const count = players.filter((player) => player.diemSo >= range.min && player.diemSo <= range.max).length
        return {
          name: range.label,
          value: count,
          fill: getColorForIndex(scoreRanges.indexOf(range)),
        }
      })
    } else if (chartType === "level") {
      const levelRanges = [
        { min: 0, max: 0, label: "Level 0" },
        { min: 1, max: 5, label: "Level 1-5" },
        { min: 6, max: 15, label: "Level 6-15" },
        { min: 16, max: 25, label: "Level 16-25" },
        { min: 26, max: 35, label: "Level 26-35" },
      ]

      data = levelRanges.map((range) => {
        const count = players.filter((player) => player.capDo >= range.min && player.capDo <= range.max).length
        return {
          name: range.label,
          value: count,
          fill: getColorForIndex(levelRanges.indexOf(range)),
        }
      })
    } else if (chartType === "money") {
      // Group players by money ranges
      const moneyRanges = [
        { min: 0, max: 950, label: "0-950" },
        { min: 951, max: 975, label: "951-975" },
        { min: 976, max: 985, label: "976-985" },
        { min: 986, max: 995, label: "986-995" },
        { min: 996, max: 1000, label: "996-1000" },
      ]

      data = moneyRanges.map((range) => {
        const count = players.filter((player) => player.soTien >= range.min && player.soTien <= range.max).length
        return {
          name: range.label,
          value: count,
          fill: getColorForIndex(moneyRanges.indexOf(range)),
        }
      })
    }

    // Sort data in descending order by value
    data.sort((a, b) => b.value - a.value)
    setChartData(data)
  }

  const getColorForIndex = (index: number) => {
    const colors = ["#f43f5e", "#fb7185", "#fda4af", "#fecdd3", "#ffe4e6"]
    return colors[index % colors.length]
  }

  const renderChart = () => {
    if (visualizationType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                fontSize: "14px", 
                fontWeight: "500", 
                backgroundColor: "white", 
                borderRadius: "8px", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)" 
              }} 
            />
            <Legend 
              formatter={(value) => <span style={{ fontSize: "14px", color: "#444" }}>{value}</span>} 
              verticalAlign="bottom" 
              height={36}
            />
            <Bar dataKey="value" fill="#f43f5e" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorForIndex(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    } else if (visualizationType === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                fontSize: "14px", 
                fontWeight: "500", 
                backgroundColor: "white", 
                borderRadius: "8px", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)" 
              }} 
            />
            <Legend 
              formatter={(value) => <span style={{ fontSize: "14px", color: "#444" }}>{value}</span>} 
              verticalAlign="bottom" 
              height={36}
            />
            <Line type="monotone" dataKey="value" stroke="#f43f5e" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )
    } else if (visualizationType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <RechartsPieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#f43f5e"
              dataKey="value"
              innerRadius={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorForIndex(index)} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} players`, "Count"]}
              contentStyle={{ 
                fontSize: "14px", 
                fontWeight: "500", 
                backgroundColor: "white", 
                borderRadius: "8px", 
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)" 
              }} 
            />
            <Legend 
              formatter={(value) => <span style={{ fontSize: "14px", color: "#444" }}>{value}</span>}
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={12}
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      )
    }
  }

  const getChartTitle = () => {
    if (chartType === "score") {
      return "Phân Bố Người Chơi Theo Điểm"
    } else if (chartType === "level") {
      return "Phân Bố Người Chơi Theo Cấp Độ"
    } else if (chartType === "money") {
      return "Phân Bố Người Chơi Theo Tiền"
    }
    return ""
  }

  const handleDeleteClick = (playerId: number) => {
    setPlayerToDelete(playerId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (playerToDelete === null) return

    setIsLoading(true)

    try {
      const apiController = new ApiController()
      await apiController.delete(`/NguoiChoi/${playerToDelete}`)
      
      // Update the UI by removing the deleted player
      setPlayers(players.filter(player => player.maNguoiChoi !== playerToDelete))
      setError(null) // Clear any previous errors
    } catch (error) {
      console.error('Error deleting player:', error)
      setError(`Error deleting player: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setPlayerToDelete(null)
    }
  }

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

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
              <p className="font-bold">Lỗi</p>
              <p>{error}</p>
            </div>
          )}

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Quản Lý Người Chơi</h1>
              <p className="text-gray-600 mt-1">Xem và quản lý tài khoản người chơi</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Tổng Người Chơi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-500">{players.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Trung Bình Cấp Độ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-500">
                  {players.length > 0 
                    ? Math.round(players.reduce((acc, player) => acc + player.capDo, 0) / players.length) 
                    : 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Trung Bình Điểm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-500">
                  {players.length > 0
                    ? Math.round(players.reduce((acc, player) => acc + player.diemSo, 0) / players.length)
                    : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>{getChartTitle()}</CardTitle>
                  <CardDescription>Hiển thị phân bố người chơi</CardDescription>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={visualizationType === "bar" ? "default" : "ghost"}
                      size="sm"
                      className={
                        visualizationType === "bar" ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-600"
                      }
                      onClick={() => setVisualizationType("bar")}
                    >
                      <BarChart2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={visualizationType === "line" ? "default" : "ghost"}
                      size="sm"
                      className={
                        visualizationType === "line" ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-600"
                      }
                      onClick={() => setVisualizationType("line")}
                    >
                      <LucideLineChart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={visualizationType === "pie" ? "default" : "ghost"}
                      size="sm"
                      className={
                        visualizationType === "pie" ? "bg-rose-500 hover:bg-rose-600 text-white" : "text-gray-600"
                      }
                      onClick={() => setVisualizationType("pie")}
                    >
                      <PieChart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Đang tải dữ liệu biểu đồ...</p>
                </div>
              ) : (
                <Tabs defaultValue="score" onValueChange={(value) => setChartType(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="score" className="rounded-full">
                      Theo Điểm
                    </TabsTrigger>
                    <TabsTrigger value="level" className="rounded-full">
                      Theo Cấp Độ
                    </TabsTrigger>
                    <TabsTrigger value="money" className="rounded-full">
                      Theo Tiền
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="score">{renderChart()}</TabsContent>
                  <TabsContent value="level">{renderChart()}</TabsContent>
                  <TabsContent value="money">{renderChart()}</TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Tìm kiếm theo mã người chơi..."
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

          {/* Players Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Đang tải dữ liệu người chơi...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Mã Người Chơi</TableHead>
                      <TableHead>Số Tiền</TableHead>
                      <TableHead>Số Kinh Nghiệm</TableHead>
                      <TableHead>Số Gợi Ý</TableHead>
                      <TableHead>Cấp Độ</TableHead>
                      <TableHead>Điểm Số</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow key={player.maNguoiChoi} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{player.maNguoiChoi}</TableCell>
                        <TableCell>{player.soTien}</TableCell>
                        <TableCell>{player.soKinhNghiem}</TableCell>
                        <TableCell>{player.soGoiY}</TableCell>
                        <TableCell>{player.capDo}</TableCell>
                        <TableCell>{player.diemSo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Hiển thị <span className="font-medium">1</span> đến{" "}
                <span className="font-medium">{filteredPlayers.length}</span> trên{" "}
                <span className="font-medium">{filteredPlayers.length}</span> người chơi
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Player</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this player? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? "Deleting..." : "Delete Player"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
