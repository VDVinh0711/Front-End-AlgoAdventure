import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/ui/navigation"
import GameCard from "@/components/ui/GameCard"

// Games data
const gamesData = [
  { 
    imageSrc: "/images/games/logo_game_mergememe.jpg", 
    name: "Merge Meme", 
    description: "Trò chơi ghép hình thú vị" 
  },
  { 
    imageSrc: "/images/games/logo_game_bubbe_around.png", 
    name: "Bubble Around", 
    description: "Game bắn bóng hấp dẫn" 
  },
  { 
    imageSrc: "/images/games/logo_game_mergememe.jpg", 
    name: "Adventure Quest", 
    description: "Phiêu lưu đầy thử thách" 
  },
  { 
    imageSrc: "/images/games/logo_game_bubbe_around.png", 
    name: "Racing Pro", 
    description: "Đua xe tốc độ cao" 
  },
  { 
    imageSrc: "/images/games/logo_game_mergememe.jpg", 
    name: "Puzzle Master", 
    description: "Thử thách trí tuệ" 
  },
  { 
    imageSrc: "/images/games/logo_game_bubbe_around.png", 
    name: "Card Battle", 
    description: "Chiến đấu thẻ bài" 
  }
]

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

          <p className="text-gray-800 text-lg md:text-xl mb-10">sản phẩm tuyệt vời được tạo ra bởi những đội ngũ tuyệt vời</p>

          <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-8 py-6 text-lg font-medium">
            Tất Cả Trò Chơi
          </Button>
        </div>

        {/* Game Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top Left */}
          <div className="absolute top-[20%] left-[15%] transform -translate-x-1/2 -translate-y-1/2 rotate-[-15deg]">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-24 w-24 md:h-32 md:w-32">
              <Image
                src="/images/games/logo_game_mergememe.jpg"
                alt="Merge Meme - Trò chơi ghép hình"
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
                src="/images/games/logo_game_bubbe_around.png"
                alt="Bubble Around - Game bắn bóng"
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
                src="/images/games/logo_game_mergememe.jpg"
                alt="Merge Meme - Trò chơi ghép hình"
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
                src="/images/games/logo_game_bubbe_around.png"
                alt="Bubble Around - Game bắn bóng"
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
                src="/images/games/logo_game_mergememe.jpg"
                alt="Merge Meme - Trò chơi ghép hình"
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
                src="/images/games/logo_game_bubbe_around.png"
                alt="Bubble Around - Game bắn bóng"
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
            <h2 className="text-3xl font-bold text-rose-500 mb-6 text-center">Chào Mừng Đến Với PURUS GAME</h2>

            <p className="text-lg mb-4">
            PURUSGAME là một studio phát triển game mobile, được thành lập từ năm 2020. Chúng tôi chuyên cung cấp dịch vụ outsourcing, sản xuất playable ads và phát hành các tựa game di động.
            </p>

            <p className="text-lg mb-4">
            Với đội ngũ giàu kinh nghiệm, PURUSGAME đã tham gia nhiều dự án thuộc các thể loại khác nhau như game giải đố, game đua xe, game thẻ bài, v.v. Mỗi sản phẩm đều được chúng tôi chú trọng vào yếu tố hình ảnh, trải nghiệm người chơi và tính hoàn thiện.
            </p>

            <p className="text-lg mb-6">
            Chúng tôi tin rằng sự hợp tác hiệu quả và tinh thần làm việc nghiêm túc là nền tảng để tạo ra những sản phẩm chất lượng, mang lại giá trị cho cả đối tác lẫn người chơi.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
             
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-rose-500 mb-12 text-center">Team</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Khiêm Banner */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src="/images/team/CEO.png"
                      alt="Khiêm - Production & Publishing Lead"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-rose-500 mb-2">Khiêm</h3>
                  <p className="text-lg text-gray-600 mb-4">Production & Publishing Lead</p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700">
                      Chuyên gia dẫn dắt quy trình sản xuất và phát hành game, 
                      đảm bảo chất lượng và thời gian ra mắt sản phẩm.
                    </p>
                  </div>
                </div>
              </div>

              {/* Hải Banner */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="p-8 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src="/images/team/CTO.png"
                      alt="Hải - Outsourcing Lead"
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-rose-500 mb-2">Hải</h3>
                  <p className="text-lg text-gray-600 mb-4">Outsourcing Lead</p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700">
                      Quản lý và điều phối các dự án outsourcing, 
                      tối ưu hóa nguồn lực và chất lượng sản phẩm.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Games Slider Section */}
        <section className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-rose-500 mb-12 text-center">Trò Chơi Của Chúng Tôi</h2>
            
            <div className="relative overflow-hidden">
              <div className="flex animate-slide space-x-6">
                {/* Render games twice for seamless loop */}
                {[...gamesData, ...gamesData].map((game, index) => (
                  <GameCard
                    key={index}
                    imageSrc={game.imageSrc}
                    name={game.name}
                    description={game.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
