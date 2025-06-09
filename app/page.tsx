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
              PURUS GAME là một studio phát triển game mobile hàng đầu, chuyên tạo ra những trải nghiệm gaming thú vị, 
              hấp dẫn và sáng tạo cho người chơi ở mọi lứa tuổi. Với trụ sở chính tại Singapore, chúng tôi đã phát triển 
              những tựa game đáng nhớ từ năm 2025.
            </p>

            <p className="text-lg mb-4">
              Danh mục game đa dạng của chúng tôi bao gồm trò chơi giải đố phiêu lưu, game đua xe, game bài và nhiều thể loại khác - 
              mỗi game đều được thiết kế với sự kết hợp đặc trưng của đồ họa đầy màu sắc, lối chơi trực quan và sự chú ý đến từng 
              chi tiết giúp người chơi luôn muốn quay lại.
            </p>

            <p className="text-lg mb-6">
              Tại Gametamin, chúng tôi tin rằng "sản phẩm tuyệt vời được tạo ra bởi những đội ngũ tuyệt vời." 
              Triết lý này định hướng mọi hoạt động của chúng tôi, từ quy trình phát triển hợp tác đến mối quan hệ 
              với cộng đồng người chơi. Chúng tôi không ngừng đẩy ranh giới của game mobile đồng thời duy trì cam kết 
              về chất lượng và sự hài lòng của người chơi.
            </p>

            <div className="flex justify-center gap-4 flex-wrap">
             
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
