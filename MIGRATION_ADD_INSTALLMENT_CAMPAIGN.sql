-- Migration: installment_campaign sütunu ekleme
-- Bu SQL kodunu Supabase Dashboard > SQL Editor'da çalıştırın
-- Tarih: 2025-10-23

-- phones tablosuna installment_campaign sütunu ekle
ALTER TABLE public.phones 
ADD COLUMN IF NOT EXISTS installment_campaign TEXT;

-- Yorum ekle
COMMENT ON COLUMN public.phones.installment_campaign IS 'Taksit kampanya bilgisi (örn: "Ziraat 4, Kuveyt 5")';

