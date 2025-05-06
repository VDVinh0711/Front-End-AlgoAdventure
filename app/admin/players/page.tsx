"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, ArrowLeft, Plus, Search, Filter, Trash, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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

export default function PlayersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [players, setPlayers] = useState(playerData)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [playerToDelete, setPlayerToDelete] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter players based on search term
  const filteredPlayers = players.filter((player) => player.maNguoiChoi.toString().includes(searchTerm))

  const handleDeleteClick = (playerId: number) => {
    setPlayerToDelete(playerId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (playerToDelete === null) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setPlayers(players.filter((player) => player.id !== playerToDelete))
      setIsLoading(false)
      setIsDeleteDialogOpen(false)
      setPlayerToDelete(null)
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
              <h1 className="text-3xl font-bold text-rose-500">Manage Players</h1>
              <p className="text-gray-600 mt-1">View and manage player accounts</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Player
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by player ID..."
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

          {/* Players Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                  {filteredPlayers.map((player) => (
                    <TableRow key={player.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{player.maNguoiChoi}</TableCell>
                      <TableCell>{player.soTien}</TableCell>
                      <TableCell>{player.soKinhNghiem}</TableCell>
                      <TableCell>{player.soGioY}</TableCell>
                      <TableCell>{player.capDo}</TableCell>
                      <TableCell>{player.diemSo}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/players/edit/${player.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-blue-500 border-blue-500 hover:bg-blue-50"
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-50"
                            onClick={() => handleDeleteClick(player.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-4 border-t">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{filteredPlayers.length}</span> of{" "}
                <span className="font-medium">{filteredPlayers.length}</span> players
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
