import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-rose-50 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-rose-500 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không Tìm Thấy Trang</h2>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-full">
              Về Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 