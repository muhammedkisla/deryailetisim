// Telefon ürün tipi
export interface Phone {
  id: string;
  brand: string; // Marka (örn: Apple, Samsung)
  model: string; // Model (örn: iPhone 15 Pro Max 256GB)
  colors: string[]; // Renk seçenekleri (örn: ["Siyah", "Beyaz", "Gold"])
  cashPrice: number; // Nakit fiyat
  installmentRate: number; // Taksit oranı (örn: 1.15 = %15 fazla)
  singlePaymentRate: number; // Tek çekim oranı (örn: 1.05 = %5 fazla)
  imageUrl?: string;
  stock: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hesaplanmış fiyatlar
export interface CalculatedPrices {
  cash: number;
  singlePayment: number;
  installment: number;
}

// Admin kullanıcı tipi
export interface User {
  id: string;
  email: string;
  name: string;
}

// İletişim bilgileri
export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
}
