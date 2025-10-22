# Derya İletişim - Telefon Mağazası Web Sitesi

Bu proje, Derya İletişim telefon mağazası için geliştirilmiş bir tanıtım ve fiyat listesi web sitesidir.

## 🎯 Proje Özellikleri

### 1. Ana Sayfa (Landing Page)

- Derya İletişim tanıtımı
- Hakkımızda bilgileri
- Sunulan hizmetler
- İletişim bilgileri
- Çalışma saatleri
- Modern ve profesyonel tasarım

**URL:** `/` - http://localhost:3000

### 2. Fiyat Listesi Sayfası

- Tüm telefon modellerinin listesi
- **Otomatik fiyat hesaplama:**
  - Nakit fiyat (temel fiyat)
  - Tek çekim fiyat (nakit üzerinden %5 fazla)
  - Taksitli fiyat (nakit üzerinden %15 fazla)
- Arama/filtreleme özelliği
- Stok durumu gösterimi
- Marka ve model bilgileri

**URL:** `/fiyat-listesi` - http://localhost:3000/fiyat-listesi

### 3. Admin Yönetim Paneli

- Email ve şifre ile giriş
- Telefon ekleme/düzenleme/silme
- Gerçek zamanlı fiyat önizlemesi
- Stok yönetimi
- İstatistikler dashboard'u

**URL:** `/admin/login` - http://localhost:3000/admin/login

**Demo Giriş Bilgileri:**

- E-posta: `admin@deryailetisim.com`
- Şifre: `admin123`

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- npm veya yarn

### Kurulum Adımları

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

3. Tarayıcınızda açın:

```
http://localhost:3000
```

## 📁 Proje Yapısı

```
deryailetisim/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin paneli
│   │   │   ├── dashboard/        # Yönetim dashboard
│   │   │   ├── login/            # Admin giriş sayfası
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── fiyat-listesi/        # Fiyat listesi sayfası
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Ana sayfa
│   ├── components/               # React bileşenleri
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── PhoneCard.tsx
│   ├── lib/                      # Yardımcı fonksiyonlar
│   │   ├── priceCalculator.ts   # Fiyat hesaplama
│   │   └── supabase.ts          # Supabase client (hazırlık)
│   └── types/                    # TypeScript tipleri
│       └── index.ts
├── public/                       # Statik dosyalar
├── SUPABASE_SETUP.md            # Supabase kurulum rehberi
└── README_PROJE.md              # Bu dosya
```

## 💰 Fiyat Hesaplama Sistemi

Sistem, nakit fiyatı temel alarak diğer fiyatları otomatik hesaplar:

- **Nakit Fiyat:** Mağazanın belirlediği temel fiyat
- **Tek Çekim:** Nakit fiyat × 1.05 (varsayılan %5 fazla)
- **Taksitli:** Nakit fiyat × 1.15 (varsayılan %15 fazla)

Oranlar admin panelinden her ürün için ayrı ayrı ayarlanabilir.

## 🛠️ Teknolojiler

- **Framework:** Next.js 15 (App Router)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **Icons:** Heroicons (SVG)
- **Database (Hazırlık):** Supabase
- **Authentication (Hazırlık):** Supabase Auth

## 📝 Önemli Notlar

### Şu Anki Durum

- ✅ Tüm sayfalar ve bileşenler oluşturuldu
- ✅ Fiyat hesaplama sistemi çalışıyor
- ✅ Admin paneli temel fonksiyonları ile hazır
- ⚠️ Veriler şu anda geçici (mock data)
- ⚠️ Admin girişi session storage ile yapılıyor

### Supabase Entegrasyonu İçin

Projeye Supabase entegre etmek için `SUPABASE_SETUP.md` dosyasındaki adımları takip edin.

**Supabase kurulumu sonrası:**

- Veriler kalıcı olacak
- Gerçek authentication sistemi çalışacak
- Real-time güncelleme eklenebilir
- Telefon görselleri yüklenebilir

## 🎨 Tasarım Özellikleri

- **Responsive:** Mobil, tablet ve desktop uyumlu
- **Modern UI:** Gradient renkler, shadow efektleri
- **Kullanıcı Dostu:** Kolay navigasyon ve anlaşılır arayüz
- **Profesyonel:** İş kullanımına uygun tasarım
- **Accessibility:** Semantik HTML ve ARIA etiketleri

## 🔐 Güvenlik

### Şu Anki Durum (Geliştirme)

- Basit session tabanlı auth
- Demo giriş bilgileri

### Production İçin Yapılması Gerekenler

- Supabase Authentication entegrasyonu
- Environment variables (.env.local)
- Row Level Security (RLS) politikaları
- HTTPS kullanımı
- Rate limiting
- CSRF koruması

## 📱 Sayfa Yapısı

### Ana Sayfa (/)

1. Hero Section - Karşılama bölümü
2. Hakkımızda - Şirket tanıtımı
3. Hizmetlerimiz - Sunulan hizmetler
4. İletişim - İletişim bilgileri ve çalışma saatleri

### Fiyat Listesi (/fiyat-listesi)

1. Başlık ve açıklama
2. Arama kutusu
3. Fiyat türleri açıklaması
4. Telefon kartları (grid layout)
5. Bilgilendirme mesajı

### Admin Paneli (/admin)

1. **Login Sayfası** (`/admin/login`)

   - Email/şifre girişi
   - Demo bilgileri

2. **Dashboard** (`/admin/dashboard`)
   - İstatistikler (toplam ürün, stok durumu)
   - Yeni ürün ekleme formu
   - Ürün listesi tablosu
   - Düzenleme/silme işlemleri

## 🚧 Gelecek Geliştirmeler

- [ ] Supabase entegrasyonu
- [ ] Telefon görseli upload
- [ ] Kategori bazlı filtreleme
- [ ] Fiyat geçmişi takibi
- [ ] Email bildirimleri
- [ ] Stok uyarıları
- [ ] PDF fiyat listesi export
- [ ] Çoklu admin kullanıcı yönetimi
- [ ] Activity log (işlem kayıtları)

## 📞 İletişim

Proje ile ilgili sorularınız için:

- Email: info@deryailetisim.com
- Telefon: +90 (XXX) XXX XX XX

## 📄 Lisans

Bu proje Derya İletişim için özel olarak geliştirilmiştir.
