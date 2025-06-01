import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-rose-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-rose-500 mb-8 text-center">About Gametamin</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Our Story</h2>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <div className="rounded-xl overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=300&text=Gametamin+Team"
                    alt="Gametamin Team"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg mb-4">
                  Founded in 2015, Gametamin began with a small team of passionate game developers who shared a vision:
                  to create mobile games that bring joy to players worldwide while maintaining the highest standards of
                  quality and innovation.
                </p>
                <p className="text-lg mb-4">
                  What started as a small indie studio has grown into a dynamic team of over 50 talented individuals,
                  each bringing unique skills and perspectives to our creative process. Our headquarters in Singapore
                  serves as the hub for our global operations, allowing us to reach players across continents.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-rose-500 mb-4">Our Mission</h2>
            <p className="text-lg mb-6">
              At Gametamin, our mission is encapsulated in our slogan: "Achieve Together." We believe that the best
              games are created when talented individuals collaborate, share ideas, and work toward a common goal. This
              philosophy extends beyond our internal teams to include our relationship with our players, whose feedback
              and support drive our continuous improvement.
            </p>

            <h2 className="text-2xl font-bold text-rose-500 mb-4">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-rose-600 mb-2">Player-Centric Design</h3>
                <p>
                  We put players at the center of everything we do, creating games that are intuitive, engaging, and
                  accessible to everyone.
                </p>
              </div>
              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-rose-600 mb-2">Innovation</h3>
                <p>
                  We constantly explore new technologies and gameplay mechanics to deliver fresh experiences that stand
                  out in the crowded mobile market.
                </p>
              </div>
              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-rose-600 mb-2">Quality</h3>
                <p>
                  We never compromise on quality, ensuring that every game we release meets our high standards for
                  performance, design, and fun.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-rose-500 mb-4">Our Achievements</h2>
            <p className="text-lg mb-4">
              Since our founding, Gametamin has released over 20 successful mobile games across various genres,
              accumulating more than 50 million downloads worldwide. Our titles have been featured on both the App Store
              and Google Play, and we've received multiple industry awards for innovation and excellence in mobile
              gaming.
            </p>
            <p className="text-lg mb-6">
              We're particularly proud of our community engagement, with an active player base that provides valuable
              feedback and has helped shape our games into what they are today.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Join Our Journey</h2>
            <p className="text-lg mb-6">
              Whether you're a player enjoying our games, a potential team member looking to contribute your talents, or
              a business partner interested in collaboration, we invite you to be part of the Gametamin story. Together,
              we can continue to create memorable gaming experiences that bring joy to millions around the world.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/games">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">
                  Explore Our Games
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-6">Contact Us</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-50 rounded-full px-6">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
