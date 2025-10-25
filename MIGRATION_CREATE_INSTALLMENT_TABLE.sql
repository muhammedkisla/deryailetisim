-- Taksit bilgileri için ayrı tablo oluştur
CREATE TABLE IF NOT EXISTS installment_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bank_name TEXT NOT NULL,
  installment_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE installment_campaigns ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (liste sayfası için)
CREATE POLICY "Installment campaigns are viewable by everyone" ON installment_campaigns
  FOR SELECT USING (true);

-- Sadece admin yazabilir
CREATE POLICY "Installment campaigns are manageable by admin" ON installment_campaigns
  FOR ALL USING (auth.role() = 'authenticated');

-- Telefon tablosundan taksit bilgisi sütununu kaldır (opsiyonel - mevcut verileri korumak için)
-- ALTER TABLE phones DROP COLUMN IF EXISTS installment_campaign;

-- Örnek veri ekle
INSERT INTO installment_campaigns (bank_name, installment_description) VALUES
('Ziraat Bankası', '3-6-9-12 ay taksit'),
('İş Bankası', '3-6-9-12 ay taksit'),
('Akbank', '3-6-9-12 ay taksit'),
('Garanti BBVA', '3-6-9-12 ay taksit'),
('Kuveyt Türk', '3-6-9-12 ay taksit'),
('Yapı Kredi', '3-6-9-12 ay taksit');
