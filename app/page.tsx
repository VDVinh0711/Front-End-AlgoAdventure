import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/ui/navigation"
export default function Home() {
  return (
    <div className="min-h-screen bg-rose-50">
      {/* Navigation */}
      
      <Navigation />
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 relative">
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          <h1 className="text-rose-500 font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-4">
            PURUS GAME
          </h1>
          <div className="text-rose-500 font-extrabold text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-6">
           BEYOND
          </div>
          <div className="text-rose-500 font-extrabold text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-8 flex items-center">
        
            THE KNOWN
          </div>

          <p className="text-gray-800 text-lg md:text-xl mb-10">great products are created by great teams</p>

          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 py-6 text-lg font-medium">
            All Games
          </Button>
        </div>

        {/* Game Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top Left */}
          <div className="absolute top-[20%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Game 1"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>

          {/* Top Right */}
          <div className="absolute top-[20%] right-[15%] transform translate-x-1/2 -translate-y-1/2 rotate-[15deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Game 2"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>

          {/* Middle Left */}
          <div className="absolute top-[50%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 rotate-[10deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Game 3"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>

          {/* Middle Right */}
          <div className="absolute top-[50%] right-[10%] transform translate-x-1/2 -translate-y-1/2 rotate-[-10deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Game 4"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom Left */}
          <div className="absolute bottom-[10%] left-[20%] transform -translate-x-1/2 translate-y-1/2 rotate-[-5deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Game 5"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom Right */}
          <div className="absolute bottom-[10%] right-[20%] transform translate-x-1/2 translate-y-1/2 rotate-[5deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/placeholder.svg?height=150&width=150"
                alt="Game 6"
                width={150}
                height={150}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-rose-500 mb-6 text-center">Welcome to Gametamin</h2>

            <p className="text-lg mb-4">
              Gametamin is a leading mobile game development studio dedicated to creating fun, engaging, and innovative
              gaming experiences for players of all ages. With our headquarters in Singapore, we've been crafting
              memorable games since 2015.
            </p>

            <p className="text-lg mb-4">
              Our diverse portfolio includes puzzle adventures, racing games, card games, and more - each designed with
              our signature blend of colorful graphics, intuitive gameplay, and attention to detail that keeps players
              coming back for more.
            </p>

            <p className="text-lg mb-6">
              At Gametamin, we believe that "great products are created by great teams." This philosophy guides
              everything we do, from our collaborative development process to our relationship with our player
              community. We're constantly pushing the boundaries of mobile gaming while maintaining our commitment to
              quality and player satisfaction.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/about">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">
                  Learn More About Us
                </Button>
              </Link>
              <Link href="/games">
                <Button variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-50 rounded-full px-6">
                  Discover Our Games
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-50 rounded-full px-6">
                  Login / Register
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
