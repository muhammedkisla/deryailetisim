-- Derya İletişim - Phones Tablosu
-- Bu SQL kodunu Supabase Dashboard > SQL Editor'da çalıştırın

-- Phones tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.phones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    colors TEXT[] NOT NULL DEFAULT '{}',
    cash_price DECIMAL(10,2) NOT NULL,
    single_payment_rate DECIMAL(4,2) NOT NULL DEFAULT 1.05,
    installment_rate DECIMAL(4,2) NOT NULL DEFAULT 1.15,
    -- Computed columns (STORED): Veritabanında hesaplanır, her sorguda yeniden hesaplamaz
    single_payment_price DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(cash_price * single_payment_rate, 2)) STORED,
    installment_price DECIMAL(10,2) GENERATED ALWAYS AS (ROUND(cash_price * installment_rate, 2)) STORED,
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

-- Örnek başlangıç verileri (opsiyonel)
INSERT INTO public.phones (brand, model, colors, cash_price, single_payment_rate, installment_rate, stock) VALUES
('Apple', 'iPhone 15 Pro Max 256GB', ARRAY['Siyah', 'Beyaz', 'Titanyum Mavi', 'Titanyum Gri'], 115000.00, 1.05, 1.15, true),
('Apple', 'iPhone 15 Pro 128GB', ARRAY['Siyah', 'Beyaz', 'Titanyum Mavi'], 58000.00, 1.05, 1.15, true),
('Apple', 'iPhone 14 128GB', ARRAY['Siyah', 'Beyaz', 'Mavi', 'Mor'], 45000.00, 1.05, 1.15, true),
('Samsung', 'Galaxy S24 Ultra 256GB', ARRAY['Titanyum Gri', 'Titanyum Mavi', 'Siyah'], 55000.00, 1.05, 1.15, true),
('Samsung', 'Galaxy S24 128GB', ARRAY['Mor', 'Yeşil', 'Beyaz'], 42000.00, 1.05, 1.15, true),
('Samsung', 'Galaxy A54 128GB', ARRAY['Yeşil', 'Siyah', 'Beyaz'], 18000.00, 1.05, 1.15, true),
('Xiaomi', 'Redmi Note 13 Pro 256GB', ARRAY['Siyah', 'Mavi', 'Yeşil'], 12000.00, 1.05, 1.15, true),
('Xiaomi', 'Xiaomi 14 Pro 256GB', ARRAY['Beyaz', 'Siyah', 'Gri'], 35000.00, 1.05, 1.15, true),
('Huawei', 'P60 Pro 256GB', ARRAY['Gold', 'Siyah', 'Gümüş'], 32000.00, 1.05, 1.15, true);

-- İndeksler (performans için)
CREATE INDEX IF NOT EXISTS idx_phones_brand ON public.phones(brand);
CREATE INDEX IF NOT EXISTS idx_phones_created_at ON public.phones(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_phones_stock ON public.phones(stock);

-- ============================================================================
-- MİGRATİON: Mevcut tabloya computed columns eklemek için
-- ============================================================================
-- Eğer tablo zaten oluşturulmuşsa ve computed columns eklemek istiyorsanız:
--
-- ALTER TABLE public.phones 
--   ADD COLUMN IF NOT EXISTS single_payment_price DECIMAL(10,2) 
--   GENERATED ALWAYS AS (ROUND(cash_price * single_payment_rate, 2)) STORED;
--
-- ALTER TABLE public.phones 
--   ADD COLUMN IF NOT EXISTS installment_price DECIMAL(10,2) 
--   GENERATED ALWAYS AS (ROUND(cash_price * installment_rate, 2)) STORED;
