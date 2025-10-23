-- Migration: Oran sütunlarının hassasiyetini artır (2 → 4 ondalık)
-- Bu SQL kodunu Supabase Dashboard > SQL Editor'da çalıştırın
-- Tarih: 2025-10-23

-- ADIM 1: Önce computed columns'ı sil (çünkü rate sütunlarını kullanıyorlar)
ALTER TABLE public.phones DROP COLUMN IF EXISTS single_payment_price;
ALTER TABLE public.phones DROP COLUMN IF EXISTS installment_price;

-- ADIM 2: Oran sütunlarının hassasiyetini artır
ALTER TABLE public.phones ALTER COLUMN single_payment_rate TYPE DECIMAL(6,4);
ALTER TABLE public.phones ALTER COLUMN installment_rate TYPE DECIMAL(6,4);

-- ADIM 3: Computed columns'ı yeni hassasiyetle yeniden oluştur
ALTER TABLE public.phones 
ADD COLUMN single_payment_price DECIMAL(10,2) 
GENERATED ALWAYS AS (ROUND(cash_price / single_payment_rate, 2)) STORED;

ALTER TABLE public.phones 
ADD COLUMN installment_price DECIMAL(10,2) 
GENERATED ALWAYS AS (ROUND(cash_price / installment_rate, 2)) STORED;
