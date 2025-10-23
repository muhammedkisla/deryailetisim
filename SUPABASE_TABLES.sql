-- Derya İletişim - Phones Tablosu
-- Bu SQL kodunu Supabase Dashboard > SQL Editor'da çalıştırın

-- Phones tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.phones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    colors TEXT[] NOT NULL DEFAULT '{}',
    cash_price DECIMAL(10,2) NOT NULL,
    single_payment_rate DECIMAL(6,4) NOT NULL DEFAULT 0.97,
    installment_rate DECIMAL(6,4) NOT NULL DEFAULT 0.93,
    installment_campaign TEXT, -- Taksit kampanya bilgisi (örn: "Ziraat 4, Kuveyt 5")
    -- Computed columns (STORED): Direkt bölme ile fiyatları otomatik hesaplar
    -- Nakit fiyat en düşük fiyattır, diğer fiyatlar = Nakit / Oran
    single_payment_price DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(cash_price / single_payment_rate, 2)) STORED,
    installment_price DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(cash_price / installment_rate, 2)) STORED,
    image_url TEXT,
    stock BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Updated_at otomatik güncellemesi için trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.phones
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) ayarları
ALTER TABLE public.phones ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (public access) - Liste sayfası için
CREATE POLICY "Herkes telefonları görüntüleyebilir"
    ON public.phones
    FOR SELECT
    USING (true);

-- Admin işlemleri için policy
-- ⚠️ ÖNEMLİ: Canlıya çıkmadan önce bu policy'leri authenticated kullanıcılar ile sınırlandırın
-- ⚠️ Şu an geliştirme aşaması için herkese açık (sessionStorage kontrolü client-side'da yapılıyor)

-- DEVELOPMENT (Geliştirme) - Şu an aktif
CREATE POLICY "Herkes telefon ekleyebilir (DEV)"
    ON public.phones
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Herkes telefon güncelleyebilir (DEV)"
    ON public.phones
    FOR UPDATE
    USING (true);

CREATE POLICY "Herkes telefon silebilir (DEV)"
    ON public.phones
    FOR DELETE
    USING (true);

-- PRODUCTION (Canlı) - Canlıya çıkmadan önce yukarıdaki policy'leri silin ve bunları aktif edin
-- DROP POLICY "Herkes telefon ekleyebilir (DEV)" ON public.phones;
-- DROP POLICY "Herkes telefon güncelleyebilir (DEV)" ON public.phones;
-- DROP POLICY "Herkes telefon silebilir (DEV)" ON public.phones;
-- 
-- CREATE POLICY "Sadece admin telefon ekleyebilir"
--     ON public.phones
--     FOR INSERT
--     WITH CHECK (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Sadece admin telefon güncelleyebilir"
--     ON public.phones
--     FOR UPDATE
--     USING (auth.role() = 'authenticated');
-- 
-- CREATE POLICY "Sadece admin telefon silebilir"
--     ON public.phones
--     FOR DELETE
--     USING (auth.role() = 'authenticated');

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_phones_brand ON public.phones(brand);
CREATE INDEX IF NOT EXISTS idx_phones_created_at ON public.phones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phones_stock ON public.phones(stock);

-- ============================================================================
-- MİGRATİON: Mevcut tabloda fiyat hesaplama değişikliği (Direkt Bölme)
-- ============================================================================
-- Eğer eski hesaplama mantığı ile (0.03, 0.07 veya 1.05, 1.15) oluşturulmuş tablo varsa:
--
-- 1. Mevcut rate değerlerini güncelle (yeni sisteme uygun hale getir)
-- UPDATE public.phones SET single_payment_rate = 0.97 WHERE single_payment_rate IN (0.03, 1.05);
-- UPDATE public.phones SET installment_rate = 0.93 WHERE installment_rate IN (0.07, 1.15);
--
-- 2. Computed columns'ı yeniden oluştur (formül değişti - direkt bölme)
-- ALTER TABLE public.phones DROP COLUMN IF EXISTS single_payment_price;
-- ALTER TABLE public.phones DROP COLUMN IF EXISTS installment_price;
--
-- ALTER TABLE public.phones 
--   ADD COLUMN single_payment_price DECIMAL(10,2) 
--   GENERATED ALWAYS AS (ROUND(cash_price / single_payment_rate, 2)) STORED;
--
-- ALTER TABLE public.phones 
--   ADD COLUMN installment_price DECIMAL(10,2) 
--   GENERATED ALWAYS AS (ROUND(cash_price / installment_rate, 2)) STORED;
