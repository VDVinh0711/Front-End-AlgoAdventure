import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Award, Layers, Users, Palette } from "lucide-react"
import Navigation from "@/components/ui/navigation"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
      {/* <header className="container mx-auto py-4 px-4 flex justify-between items-center">
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
          <Button variant="default" className="bg-rose-500 hover:bg-rose-600 rounded-full">
            Admin
          </Button>
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
      </header> */}
      <Navigation/>
      {/* Admin Dashboard */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-rose-500 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your game content and players</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Level Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Levels
                </CardTitle>
                <CardDescription className="text-rose-100">Manage game levels</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Create, edit and organize game levels and difficulty settings.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/levels" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">Manage Levels</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Achievement Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription className="text-rose-100">Manage achievements</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Create and configure player achievements and rewards.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/achievements" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                    Manage Achievements
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Skins Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Skins
                </CardTitle>
                <CardDescription className="text-rose-100">Manage game skins</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Upload and configure character skins and visual customizations.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/skins" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">Manage Skins</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Player Management */}
            <Card className="overflow-hidden border-2 border-rose-200 hover:border-rose-500 transition-colors">
              <CardHeader className="bg-rose-500 text-white">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Players
                </CardTitle>
                <CardDescription className="text-rose-100">Manage players</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">View player statistics, manage accounts and handle support.</p>
              </CardContent>
              <CardFooter>
                <Link href="/admin/players" className="w-full">
                  <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">
                    Manage Players
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Quick Stats</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Active Players</p>
                <p className="text-3xl font-bold text-rose-500">12,458</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Total Games</p>
                <p className="text-3xl font-bold text-rose-500">24</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">New Players (24h)</p>
                <p className="text-3xl font-bold text-rose-500">342</p>
              </div>
              <div className="bg-rose-50 p-4 rounded-xl text-center">
                <p className="text-gray-600 text-sm">Support Tickets</p>
                <p className="text-3xl font-bold text-rose-500">18</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
