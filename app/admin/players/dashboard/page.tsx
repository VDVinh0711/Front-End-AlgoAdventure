"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Play, ArrowLeft, BarChart2, PieChart, LineChart as LucideLineChart, Download, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  LineChart
} from "recharts"
import Navigation from "@/components/ui/navigation"

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

export default function PlayerDashboardPage() {
  const [chartData, setChartData] = useState<any[]>([])
  const [chartType, setChartType] = useState<"score" | "level" | "money">("score")
  const [visualizationType, setVisualizationType] = useState<"bar" | "line" | "pie">("pie")

  useEffect(() => {
    prepareChartData()
  }, [chartType])

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
        const count = playerData.filter((player) => player.diemSo >= range.min && player.diemSo <= range.max).length
        return {
          name: range.label,
          value: count,
          fill: getColorForIndex(scoreRanges.indexOf(range)),
        }
      })
    } else if (chartType === "level") {
      // Group players by level ranges
      const levelRanges = [
        { min: 0, max: 0, label: "Level 0" },
        { min: 1, max: 5, label: "Level 1-5" },
        { min: 6, max: 15, label: "Level 6-15" },
        { min: 16, max: 25, label: "Level 16-25" },
        { min: 26, max: 35, label: "Level 26-35" },
      ]

      data = levelRanges.map((range) => {
        const count = playerData.filter((player) => player.capDo >= range.min && player.capDo <= range.max).length
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
        const count = playerData.filter((player) => player.soTien >= range.min && player.soTien <= range.max).length
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
      return "Player Distribution by Score"
    } else if (chartType === "level") {
      return "Player Distribution by Level"
    } else if (chartType === "money") {
      return "Player Distribution by Money"
    }
    return ""
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
              Back to Dashboard
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-rose-500">Player Analytics</h1>
              <p className="text-gray-600 mt-1">View and analyze player statistics</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/admin/players">
                <Button variant="outline" className="border-rose-500 text-rose-500 hover:bg-rose-50 rounded-full">
                  Manage Players
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Players</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-500">{playerData.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Avg. Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-500">
                  {Math.round(playerData.reduce((acc, player) => acc + player.capDo, 0) / playerData.length)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Avg. Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-rose-500">
                  {Math.round(playerData.reduce((acc, player) => acc + player.diemSo, 0) / playerData.length)}
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
                  <CardDescription>Visualize player distribution</CardDescription>
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
                  <Button variant="outline" size="sm" className="text-gray-600" disabled>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="score" onValueChange={(value) => setChartType(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="score" className="rounded-full">
                    By Score
                  </TabsTrigger>
                  <TabsTrigger value="level" className="rounded-full">
                    By Level
                  </TabsTrigger>
                  <TabsTrigger value="money" className="rounded-full">
                    By Money
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="score">{renderChart()}</TabsContent>
                <TabsContent value="level">{renderChart()}</TabsContent>
                <TabsContent value="money">{renderChart()}</TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Players Table */}
          <Card>
            <CardHeader>
              <CardTitle>Player Data</CardTitle>
              <CardDescription>Detailed information about all players</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>maNguoiChoi</TableHead>
                      <TableHead>soTien</TableHead>
                      <TableHead>soKinhNghiem</TableHead>
                      <TableHead>soGioY</TableHead>
                      <TableHead>capDo</TableHead>
                      <TableHead>diemSo</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerData.map((player) => (
                      <TableRow key={player.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{player.maNguoiChoi}</TableCell>
                        <TableCell>{player.soTien}</TableCell>
                        <TableCell>{player.soKinhNghiem}</TableCell>
                        <TableCell>{player.soGioY}</TableCell>
                        <TableCell>{player.capDo}</TableCell>
                        <TableCell>{player.diemSo}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-500 border-blue-500 hover:bg-blue-50"
                              onClick={() => {
                                // In a real app, this would open a modal with detailed player data
                                alert(
                                  `Detailed data for player ${player.maNguoiChoi}:\n\nLevel: ${player.capDo}\nScore: ${player.diemSo}\nMoney: ${player.soTien}\nExperience: ${player.soKinhNghiem}\nHints: ${player.soGioY}`,
                                )
                              }}
                            >
                              <Layers className="h-4 w-4 mr-1" />
                              Show Data
                            </Button>
                            <Link href={`/admin/players/edit/${player.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-rose-500 border-rose-500 hover:bg-rose-50"
                              >
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
