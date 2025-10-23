# Production Checklist

Projeyi canlıya almadan önce kontrol edilmesi gerekenler.

## ✅ Tamamlananlar

### 1. Supabase Entegrasyonu

- [x] Veritabanı tabloları oluşturuldu
- [x] Real-time subscription aktif edildi
- [x] Artımlı güncelleme mekanizması (incremental updates)
- [x] Computed columns (single_payment_price, installment_price)
- [x] Type-safe veri dönüşümü (mapDbPhone)

### 2. Performance Optimizations

- [x] Veritabanı indeksleri (brand, created_at, stock)
- [x] STORED computed columns (client-side hesaplama yok)
- [x] Debounced polling (30 saniye)
- [x] Window focus event (sekme değiştirme)
- [x] Artımlı real-time updates (sadece değişen kayıt)

### 3. Code Quality

- [x] TypeScript type safety
- [x] Linter errors düzeltildi
- [x] Clean code patterns
- [x] DRY principle (mapDbPhone fonksiyonu)
- [x] Proper cleanup functions (unsubscribe)

---

## ⚠️ Canlıya Almadan Önce Yapılması Gerekenler

### 1. 🔒 Güvenlik - RLS Policies (ÇOK ÖNEMLİ!)

**Şu an:** Development modda, herkes INSERT/UPDATE/DELETE yapabilir (client-side sessionStorage kontrolü)

**Yapılması gereken:** Supabase RLS policy'lerini authenticated kullanıcılar ile sınırla

#### Adımlar:

1. **Supabase Dashboard → SQL Editor**

2. **Development policy'leri SİL:**

```sql
DROP POLICY "Herkes telefon ekleyebilir (DEV)" ON public.phones;
DROP POLICY "Herkes telefon güncelleyebilir (DEV)" ON public.phones;
DROP POLICY "Herkes telefon silebilir (DEV)" ON public.phones;
```

3. **Production policy'leri EKLE:**

```sql
CREATE POLICY "Sadece admin telefon ekleyebilir"
    ON public.phones
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Sadece admin telefon güncelleyebilir"
    ON public.phones
    FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Sadece admin telefon silebilir"
    ON public.phones
    FOR DELETE
    USING (auth.role() = 'authenticated');
```

4. **Supabase Auth entegrasyonu:**
   - Şu an sessionStorage ile client-side kontrol yapılıyor
   - Production'da Supabase Auth kullanılmalı
   - `/admin/login` sayfası Supabase Auth ile entegre edilmeli

---

### 2. 📊 Computed Columns Migration (Opsiyonel ama Önerilen)

Eğer tablo **zaten oluşturulmuşsa** ve computed columns eklemek istiyorsanız:

```sql
-- Mevcut tabloya computed columns ekle
ALTER TABLE public.phones
  ADD COLUMN IF NOT EXISTS single_payment_price DECIMAL(10,2)
  GENERATED ALWAYS AS (ROUND(cash_price * single_payment_rate, 2)) STORED;

ALTER TABLE public.phones
  ADD COLUMN IF NOT EXISTS installment_price DECIMAL(10,2)
  GENERATED ALWAYS AS (ROUND(cash_price * installment_rate, 2)) STORED;
```

**Avantajları:**

- Client-side hesaplama gerekmez
- Veritabanında önceden hesaplanmış değerler
- Daha hızlı query performansı
- Tutarlı sonuçlar

---

### 3. 🔐 Environment Variables

`.env.local` dosyasının production ortamında doğru ayarlandığından emin olun:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Kontrol:**

- Anon key production için mi?
- URL doğru mu?
- `.env.local` `.gitignore` içinde mi?

---

### 4. 📱 Real-time Subscription Kontrolü

Real-time'ın production'da çalıştığından emin olun:

1. Supabase Dashboard → **Database** → **Replication**
2. `phones` tablosunun Real-time için aktif olduğunu kontrol edin
3. Veya SQL Editor'de:

```sql
-- Real-time aktif mi kontrol et
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'phones';
```

Eğer sonuç gelmiyorsa:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE phones;
```

---

### 5. 🧹 Temizlik

#### Console.log'lar

Gereksiz console.log'ları temizleyin (sadece hata logları kalmalı):

- ✅ `console.error()` → Kalabilir
- ❌ `console.log()` → Production'da kaldırılmalı

#### Test/Mock Data

- Mock data kullanılmıyorsa `mockPhones` export'u kaldırılabilir
- Test verileri temizlenebilir

---

### 6. 🎨 UI/UX Final Checks

- [ ] Mobil responsive test
- [ ] Tablet responsive test
- [ ] Desktop responsive test
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Form validations
- [ ] Accessibility (a11y)

---

### 7. 📈 Performance Monitoring

Production'da izlenmesi gerekenler:

- Real-time subscription durumu
- Database query süreleri
- Page load times
- Real-time event latency

---

### 8. 🚀 Deployment

#### Vercel Deployment

1. `.env.local` değişkenlerini Vercel'e ekleyin
2. Build sürecini test edin
3. Preview deployment'ı kontrol edin
4. Production'a deploy edin

#### Post-Deployment

1. Real-time çalışıyor mu?
2. Admin login çalışıyor mu?
3. CRUD operasyonları çalışıyor mu?
4. Liste sayfası güncelleniyor mu?

---

## 🔧 Teknik Notlar

### Tekil Abonelik (Hot-reload Protection)

✅ **Halledildi:** Her component'te `return () => unsubscribe()` cleanup fonksiyonu var

```typescript
useEffect(() => {
  const unsubscribe = subscribeToPhones(...)
  return () => unsubscribe()
}, [])
```

### Client-only Realtime

✅ **Halledildi:** Tüm real-time kod'ları `"use client"` component'lerinde

### Computed Columns

✅ **Opsiyonel ama kullanımda:**

- Veritabanında hesaplanan fiyatlar
- Client-side hesaplama yok
- `single_payment_price` ve `installment_price` STORED

---

## 📝 Deployment Sonrası Kontrol

- [ ] Real-time subscription çalışıyor mu?
- [ ] Admin girişi çalışıyor mu?
- [ ] Telefon ekleme çalışıyor mu?
- [ ] Telefon güncelleme çalışıyor mu?
- [ ] Telefon silme çalışıyor mu?
- [ ] Liste sayfası otomatik güncellenİyor mu?
- [ ] Mobil görünüm düzgün mü?
- [ ] Performans kabul edilebilir mi?

---

## 🆘 Troubleshooting

### Real-time çalışmıyor

1. Supabase Dashboard'da Replication kontrol et
2. SQL ile `ALTER PUBLICATION` komutunu çalıştır
3. Browser console'da error var mı kontrol et

### Policy hatası alıyorum

1. RLS policy'leri kontrol et
2. Development policy'ler aktif mi?
3. Authenticated user var mı?

### Computed columns yok

1. Migration SQL'i çalıştır
2. Tablo şemasını kontrol et
3. Supabase Table Editor'de sütunları kontrol et

---

## 📚 Dokümantasyon

- `SUPABASE_TABLES.sql` → Tablo yapısı ve migration
- `SUPABASE_SETUP.md` → Supabase kurulum rehberi
- `SUPABASE_ENTEGRASYON_REHBERI.md` → Entegrasyon detayları
- `README.md` → Genel proje bilgisi

---

**Son Güncelleme:** 2025-01-23
