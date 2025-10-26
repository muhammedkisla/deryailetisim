# Derya İletişim - Cep Telefonu Fiyat Listesi

Konya'da faaliyet gösteren Derya İletişim cep telefonu mağazası için geliştirilmiş modern web uygulaması. Telefon fiyatlarını, taksit kampanyalarını ve banka bilgilerini görüntüleyen responsive bir platform.

## 🚀 Canlı Demo

**Production URL:** [https://deryailetisim.vercel.app](https://deryailetisim.vercel.app)

## 📋 Özellikler

### 🏠 Ana Sayfa
- **Responsive tasarım** - Mobil ve desktop uyumlu
- **Modern UI/UX** - Tailwind CSS ile tasarlanmış
- **Hakkımızda bölümü** - Mağaza bilgileri ve iletişim
- **Öne çıkan özellikler** - Hizmet tanıtımları

### 📱 Fiyat Listesi (`/liste`)
- **Telefon listesi** - Marka ve model bazında gruplandırılmış
- **Renk seçenekleri** - Her telefon için mevcut renkler
- **Fiyat hesaplama** - Nakit, tek çekim ve taksit fiyatları
- **Stok durumu** - Mevcut/mevcut değil göstergesi
- **Banka taksit kampanyaları** - Güncel taksit seçenekleri
- **Banka hesap bilgileri** - Havale/EFT bilgileri

### 🔐 Admin Paneli (`/admin`)
- **Güvenli giriş** - Supabase Auth ile kimlik doğrulama
- **Şifre sıfırlama** - Email ile şifre yenileme
- **Telefon yönetimi** - Ekleme, düzenleme, silme
- **Taksit kampanyası yönetimi** - Banka kampanyalarını yönetme
- **Real-time güncellemeler** - Supabase real-time subscriptions
- **Responsive admin arayüzü** - Mobil uyumlu yönetim paneli

## 🛠️ Teknoloji Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management
- **Next.js Image** - Optimized image loading

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database
- **Supabase Auth** - Authentication
- **Supabase Real-time** - Live updates
- **Row Level Security (RLS)** - Database security

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control
- **Environment Variables** - Configuration management

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── admin/
│   │   ├── dashboard/          # Admin paneli
│   │   ├── login/              # Giriş sayfası
│   │   └── reset-password/     # Şifre sıfırlama
│   ├── auth/
│   │   └── callback/           # Auth callback
│   ├── liste/                  # Fiyat listesi
│   └── page.tsx                # Ana sayfa
├── components/
│   ├── Toast.tsx               # Bildirim komponenti
│   └── ConfirmDialog.tsx       # Onay dialog'u
├── lib/
│   ├── supabase.ts            # Supabase konfigürasyonu
│   ├── priceCalculator.ts     # Fiyat hesaplama
│   └── colorHelper.ts         # Renk yardımcıları
└── types/
    └── index.ts               # TypeScript tipleri
```

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase hesabı

### 1. Repository'yi klonlayın
```bash
git clone https://github.com/muhammedkisla/deryailetisim.git
cd deryailetisim
```

### 2. Bağımlılıkları yükleyin
```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### 3. Environment değişkenlerini ayarlayın
`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Development server'ı başlatın
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacak.

## 🗄️ Veritabanı Yapısı

### `phones` Tablosu
```sql
CREATE TABLE phones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  colors TEXT[] NOT NULL,
  cash_price INTEGER NOT NULL,
  single_payment_rate DECIMAL(3,2) DEFAULT 0.97,
  installment_rate DECIMAL(3,2) DEFAULT 0.93,
  stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### `installment_campaigns` Tablosu
```sql
CREATE TABLE installment_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔐 Supabase Konfigürasyonu

### 1. Authentication Ayarları
- **Site URL:** `https://deryailetisim.vercel.app`
- **Redirect URLs:**
  - `https://deryailetisim.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback`

### 2. Email Templates
- **Reset Password** template'i aktif olmalı
- Custom HTML template kullanılıyor

### 3. Row Level Security (RLS)
- `phones` tablosu için RLS politikaları aktif
- `installment_campaigns` tablosu için RLS politikaları aktif

## 📱 Admin Paneli Kullanımı

### Giriş Bilgileri
- Admin paneline erişim için `/admin/login` sayfasını kullanın
- Şifre sıfırlama için "Şifremi Unuttum" linkini kullanın

### Telefon Yönetimi
1. **Yeni Telefon Ekle:**
   - Marka, model, renkler
   - Nakit fiyat
   - Oranlar (tek çekim/taksit)
   - Stok durumu

2. **Telefon Düzenle:**
   - Mevcut telefonları düzenleyin
   - Fiyat güncellemeleri
   - Stok durumu değişiklikleri

3. **Telefon Sil:**
   - Onay dialog'u ile güvenli silme

### Taksit Kampanyası Yönetimi
1. **Banka Kampanyası Ekle:**
   - Banka adı
   - Kampanya açıklaması

2. **Kampanya Düzenle/Sil:**
   - Mevcut kampanyaları yönetin

## 🎨 UI/UX Özellikleri

### Renk Paleti
- **Ana renk:** Kırmızı (#DC2626)
- **İkincil renkler:** Gri tonları
- **Accent renkler:** Mavi, yeşil

### Responsive Tasarım
- **Mobile First** yaklaşım
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Flexible grid** sistemi

### Telefon Renkleri
- 20+ farklı renk seçeneği
- Renk kodları ve hex değerleri
- Border kontrolü (açık renkler için)

## 🔧 Geliştirme Notları

### Fiyat Hesaplama
```typescript
// Nakit fiyat
const cashPrice = originalPrice * singlePaymentRate;

// Taksit fiyatı
const installmentPrice = originalPrice * installmentRate;
```

### Real-time Updates
- Supabase real-time subscriptions kullanılıyor
- Telefon listesi otomatik güncelleniyor
- Taksit kampanyaları canlı güncelleniyor

### Error Handling
- Toast notifications ile kullanıcı bildirimleri
- Try-catch blokları ile hata yakalama
- Console logging ile debug bilgileri

## 🚀 Deployment

### Vercel Deployment
1. GitHub repository'sini Vercel'e bağlayın
2. Environment variables'ları ayarlayın
3. Otomatik deploy aktif

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🐛 Bilinen Sorunlar

- Yok (Tüm özellikler test edildi ve çalışıyor)

## 🔮 Gelecek Geliştirmeler

### Önerilen Özellikler
1. **Telefon resimleri** - Supabase Storage entegrasyonu
2. **Arama/filtreleme** - Telefon arama özelliği
3. **Excel export** - Fiyat listesi dışa aktarma
4. **Bulk operations** - Toplu telefon ekleme
5. **Analytics** - Ziyaretçi istatistikleri
6. **SEO optimizasyonu** - Meta tags, sitemap

## 👥 Geliştirici Notları

### Kod Yapısı
- **Component-based** mimari
- **Custom hooks** kullanımı
- **TypeScript** strict mode
- **ESLint** ve **Prettier** konfigürasyonu

### Performans
- **Next.js Image** optimizasyonu
- **Lazy loading** implementasyonu
- **Code splitting** otomatik
- **Bundle size** optimizasyonu

### Güvenlik
- **Row Level Security** (RLS)
- **Input validation**
- **XSS protection**
- **CSRF protection**

## 📞 İletişim

**Proje Sahibi:** Derya İletişim
- **Telefon:** +90 (537) 347 08 88
- **Email:** info@deryailetisim.com
- **Adres:** Şehit Kemal Türkeş Mahallesi, İstanbul Cd. Konaltaş İş Hanı altı no:103/A, 42030 Karatay/Konya

**Geliştirici:** [GitHub Profili](https://github.com/muhammedkisla)

## 📄 Lisans

Bu proje özel mülkiyettir ve Derya İletişim'e aittir.

---

**Son Güncelleme:** Ocak 2025
**Versiyon:** 1.0.0
**Durum:** Production Ready ✅