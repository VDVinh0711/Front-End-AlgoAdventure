import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GamesPage() {
  const games = [
    { id: 1, title: "Puzzle Adventure", description: "A colorful puzzle game with challenging levels" },
    { id: 2, title: "Racing Fever", description: "Fast-paced racing game with multiple vehicles" },
    { id: 3, title: "Card Master", description: "Strategic card game with collectible cards" },
    { id: 4, title: "Farm Heroes", description: "Build and manage your own virtual farm" },
    { id: 5, title: "Cooking Dash", description: "Time management game in a busy kitchen" },
    { id: 6, title: "Police Chase", description: "Action-packed police pursuit game" },
  ]

  return (
    <div className="min-h-screen bg-rose-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-rose-500 mb-8 text-center">Our Games</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <div className="h-48 relative">
                <Image
                  src={`/placeholder.svg?height=300&width=400&text=${game.title}`}
                  alt={game.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h3>
                <p className="text-gray-600 mb-4">{game.description}</p>
                <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-full">Play Now</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
