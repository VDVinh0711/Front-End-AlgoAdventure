import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/ui/navigation"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-rose-50">
      <Navigation />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-rose-500 mb-8 text-center">Giới Thiệu Về PurusGames</h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Lịch Sử</h2>

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <div className="rounded-xl overflow-hidden">
                                      <Image
                      src="/images/imageTeams.jpg"
                      alt="PurusGames Team"
                    width={300}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg mb-4">
                PurusGames là một công ty phát triển game được thành lập cách đây 4 năm, khởi nguồn từ một nhóm nhỏ gồm 10 thành viên trẻ tuổi,
                 nhiệt huyết và đầy đam mê với ngành công nghiệp trò chơi điện tử. Từ những bước đi đầu tiên còn nhiều khó khăn,
                  công ty đã không ngừng nỗ lực và từng bước khẳng định vị thế của mình thông qua các dự án game sáng tạo, phù hợp với xu hướng thị trường.
                </p>
                <p className="text-lg mb-4">
                Đến năm 2020, PurusGames chính thức sáp nhập với công ty ABI – một đơn vị công nghệ có tiềm lực mạnh mẽ – và trở thành một 
                phòng ban chuyên phát triển game trong hệ thống của ABI. Giai đoạn này đánh dấu bước phát triển quan trọng, giúp đội ngũ
                 có cơ hội tiếp cận với quy trình làm việc chuyên nghiệp hơn, đồng thời mở rộng quy mô các dự án và nâng cao chất lượng sản phẩm.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-rose-500 mb-4">Sứ Mệnh</h2>
            <p className="text-lg mb-6">
            Sứ mệnh của chúng tôi là phát triển những tựa game hay, thú vị và sáng tạo,
             góp phần thúc đẩy sự phát triển của ngành công nghiệp game trong nước cũng như 
             tạo ra những giá trị tích cực cho cộng đồng người chơi. Chúng tôi mong muốn mang đến
              những trải nghiệm giải trí chất lượng, truyền cảm hứng học hỏi, sáng tạo và kết nối mọi người 
              thông qua từng sản phẩm mà chúng tôi xây dựng.
            </p>

            <h2 className="text-2xl font-bold text-rose-500 mb-4">Phương Pháp Làm Việc</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-rose-600 mb-2">Tập Trung Vào Người Chơi</h3>
                <p>
                  Chúng tôi luôn đặt người chơi làm trung tâm trong mọi công việc, tạo ra những trò chơi dễ hiểu, 
                  hấp dẫn và dễ tiếp cận với mọi đối tượng.
                </p>
              </div>
              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-rose-600 mb-2">Sáng Tạo</h3>
                <p>
                  Chúng tôi không ngừng khám phá các công nghệ mới và cơ chế gameplay để mang đến những trải nghiệm 
                  tươi mới, nổi bật trong thị trường game di động đầy cạnh tranh.
                </p>
              </div>
              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-rose-600 mb-2">Chất Lượng</h3>
                <p>
                  Chúng tôi không bao giờ thỏa hiệp về chất lượng, đảm bảo rằng mọi trò chơi phát hành đều đạt tiêu chuẩn 
                  cao về hiệu năng, thiết kế và tính giải trí.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-rose-500 mb-4">Thành Tựu</h2>
            <p className="text-lg mb-4">
              Kể từ khi thành lập, PurusGames đã phát hành hơn 15 tựa game di động thành công trên nhiều thể loại khác nhau,
              tích lũy được hơn 10 triệu lượt tải xuống trên toàn thế giới. Các sản phẩm của chúng tôi đã được giới thiệu 
              trên cả App Store và Google Play, và chúng tôi đã nhận được nhiều giải thưởng trong ngành về sự sáng tạo 
              và xuất sắc trong lĩnh vực game di động.
            </p>
            <p className="text-lg mb-6">
              Chúng tôi đặc biệt tự hào về sự tương tác với cộng đồng, với cơ sở người chơi tích cực luôn đóng góp 
              ý kiến quý báu và giúp định hình các trò chơi thành như ngày hôm nay.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-rose-500 mb-4">Tham Gia Hành Trình Của Chúng Tôi</h2>
            <p className="text-lg mb-6">
              Dù bạn là người chơi đang thưởng thức các trò chơi của chúng tôi, một thành viên tiềm năng muốn đóng góp 
              tài năng của mình, hay một đối tác kinh doanh quan tâm đến việc hợp tác, chúng tôi mời bạn trở thành 
              một phần trong câu chuyện của PurusGames. Cùng nhau, chúng ta có thể tiếp tục tạo ra những trải nghiệm 
              game đáng nhớ mang lại niềm vui cho hàng triệu người trên thế giới.
            </p>

                          <div className="flex flex-wrap justify-center gap-4">
                <Link href="/">
                  <Button variant="outline" className="text-rose-500 border-rose-500 hover:bg-rose-50 rounded-full px-6">
                    Về Trang Chủ
                  </Button>
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}
