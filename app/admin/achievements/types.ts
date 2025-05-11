// Achievement data interface
export interface AchievementData {
  MaNhiemVu?: number,
  TenNhiemVu: string,
  GiaTriThuong: number,
  YeuCau: number,
  LoaiNhiemVu: number,
  LoaiPhanThuong: number
}

// Achievement type interface
export interface LoaiNhiemVuData {
  MaLoaiNhiemVu: number,
  TenLoaiNhiemVu: string,
  Mota: string
}

// Reward type interface
export interface PhanThuongData {
  MaPhanThuong: number,
  TenPhanThuong: string,
  Mota: string
} 