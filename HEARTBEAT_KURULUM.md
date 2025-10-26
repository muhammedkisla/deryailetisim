# ❤️ Heartbeat Sistemi - Supabase Uyku Modundan Korunma

## 🎯 Neden Gerekli?

Supabase'in **ücretsiz versiyonu** 7 gün boyunca hiç kullanılmazsa otomatik olarak **uyku moduna** geçer. Bu durumda:

- ❌ Proje pasif hale gelir
- ❌ İlk istek 10-15 saniye gecikebilir (uyanma süresi)
- ❌ Kullanıcılar zayıf deneyim yaşar
- ❌ Müşteri bunu bilmez ve Supabase dashboard'dan aktif edemez

## ✅ Çözüm: Heartbeat Sistemi

Her gün (veya 5 günde bir) otomatik olarak sitenize bir istek atılır. Bu sayede:

- ✅ Supabase sürekli aktif kalır
- ✅ Asla uyku moduna girmez
- ✅ Kullanıcılar hızlı deneyim yaşar
- ✅ Hiç gecikme olmaz

---

## 🚀 Kurulum Adımları

### ⚠️ ÖNEMLİ GÜVENLİK NOTU

**Production kullanımı için yeni bir secret token oluşturun!**

Development'ta kullanılan token'ı production'da kullanmayın.

```bash
# Yeni token oluştur (Mac/Linux)
openssl rand -hex 32

# Örnek çıktı: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### 1️⃣ Environment Variable Ekle

`.env.local` dosyanıza şunu ekleyin:

```env
HEARTBEAT_SECRET=bunun_yerine_rastgele_bir_sifre_girin
```

**Güvenlik ipucu:** Güçlü bir şifre oluşturun:

```bash
# Mac/Linux için:
openssl rand -hex 32

# veya manuel olarak:
# Örnek: XyZ9@mN7kL5#pQ8rS4tU1vW2
```

### 2️⃣ Secret Token'ı Uygulamaya Ekle

Vercel dashboard'unuzda veya `.env.local`'inizde:

```
HEARTBEAT_SECRET=sizin_oluşturduğunuz_güçlü_sifre
```

### 3️⃣ Endpoint'i Test Edin

Projenizi deploy ettikten sonra, tarayıcınızda test edin:

```
https://deryailetisim.vercel.app/api/heartbeat?token=YOUR_SECRET_TOKEN
```

**Başarılı yanıt örneği:**

```json
{
  "ok": true,
  "timestamp": "2024-01-15T10:30:45.123Z",
  "count": 42
}
```

### 4️⃣ Cron Job Oluşturma (cron-job.org)

1. **https://cron-job.org** sitesine gidin ve ücretsiz hesap oluşturun

2. **"Create cronjob"** butonuna tıklayın

3. **Ayarları girin:**

   ```
   Title: Supabase Heartbeat
   Address: https://deryailetisim.vercel.app/api/heartbeat?token=YOUR_SECRET_TOKEN
   Schedule: Every day at 08:00 (veya istediğiniz saat)
   ```

4. **Schedule Seçenekleri:**

   - **Her gün:** `Every day at 08:00`
   - **Her 5 günde bir:** `Every 5 days at 08:00`
   - **Haftada bir:** `Every Monday at 08:00`

5. **"Create cronjob"** butonuna tıklayın

6. ✅ **Test etmek için:** "Execute now" butonuna basın

---

## 🔧 Alternatif: GitHub Actions

Eğer cron-job.org kullanmak istemezseniz, GitHub Actions da kullanabilirsiniz:

`.github/workflows/heartbeat.yml` dosyası oluşturun:

```yaml
name: Supabase Heartbeat

on:
  schedule:
    # Her gün saat 08:00'de (UTC)
    - cron: "0 8 * * *"
  workflow_dispatch: # Manuel çalıştırma için

jobs:
  heartbeat:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Heartbeat
        run: |
          curl -X GET "${{ secrets.HEARTBEAT_URL }}?token=${{ secrets.HEARTBEAT_SECRET }}"
```

**GitHub Secrets ekleyin:**

- `HEARTBEAT_URL`: `https://deryailetisim.vercel.app/api/heartbeat`
- `HEARTBEAT_SECRET`: Sizin oluşturduğunuz şifre

---

## 📊 Nasıl Çalışıyor?

### Endpoint Detayları

```typescript
GET /api/heartbeat?token=SECRET
```

**Yaptığı işlemler:**

1. ✅ Token kontrolü (güvenlik)
2. ✅ Supabase Service Role ile bağlanır
3. ✅ `phones` tablosuna hafif bir HEAD sorgusu atar
4. ✅ Sadece count döner (veri çekmez, hızlıdır)
5. ✅ Supabase aktif kalır ✨

### Performans

- ⚡ Çok hızlı (50-100ms)
- 💰 Bedava (Supabase free tier yeterli)
- 🔒 Güvenli (secret token ile korumalı)

---

## 🧪 Test Etme

### Manuel Test

Terminal'de çalıştırın:

```bash
curl "https://deryailetisim.vercel.app/api/heartbeat?token=YOUR_SECRET_TOKEN"
```

**Beklenen çıktı:**

```json
{ "ok": true, "timestamp": "2024-01-15T10:30:45.123Z", "count": 42 }
```

### Cron Job Test

cron-job.org'da "Execute now" butonuna basın ve log'ları kontrol edin.

---

## ⚠️ Önemli Notlar

1. **Secret Token'ı asla GitHub'a commit etmeyin**
2. **Vercel'de environment variable olarak ekleyin**
3. **Cron job'un günde en az 1 kez çalıştığından emin olun**
4. **Test ettikten sonra cron job'u aktif edin**

---

## 🆘 Sorun Giderme

### 401 Unauthorized Hatası

```
{"ok":false,"error":"unauthorized"}
```

**Çözüm:** `HEARTBEAT_SECRET` environment variable'ının doğru olduğundan emin olun.

### 500 Internal Server Error

**Çözüm:** Vercel logs'ları kontrol edin. Büyük ihtimalle `.env.local` dosyasında değişken eksiktir.

### Cron Job Çalışmıyor

**Çözüm:**

1. cron-job.org'da "Test run" yapın
2. Log'ları kontrol edin
3. URL'nin doğru olduğundan emin olun

---

## 📈 Monitoring

cron-job.org dashboard'undan:

- ✅ Son çalışma zamanı
- ✅ Response status
- ✅ Response time
- ✅ Error logs

---

## 💡 Ekstra Özellikler

### Slack Bildirimi

Cron job'a Slack webhook ekleyebilirsiniz (opsiyonel):

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"✅ Supabase heartbeat başarılı"}' \
  YOUR_SLACK_WEBHOOK_URL
```

### Uptime Monitoring

cron-job.org'u uptime monitoring olarak da kullanabilirsiniz:

- Site down olursa size bildirim gönderir
- Response time'ı ölçer
- Geçmiş metrikleri gösterir

---

## ✅ Kontrol Listesi

- [ ] `.env.local`'e `HEARTBEAT_SECRET` eklendi
- [ ] Vercel'de environment variable ayarlandı
- [ ] Endpoint test edildi (başarılı yanıt aldım)
- [ ] cron-job.org'da hesap oluşturuldu
- [ ] Cron job ayarlandı ve test edildi
- [ ] Cron job aktif edildi
- [ ] İlk otomatik çalışmayı bekledim

---

**🎉 Artık Supabase'iniz asla uyku moduna girmeyecek!**

---

## 🎊 Kurulum Tamamlandı!

Eğer cron-job.org'da status 200 aldıysanız, sistem başarıyla kurulmuş demektir! 🎉

### 📋 Yapılması Gerekenler

1. ✅ **Cron job aktif mi kontrol edin**

   - cron-job.org dashboard'unuzda cron job'un **aktif** olduğundan emin olun
   - Schedule ayarını kontrol edin (örnek: "Every day at 08:00")

2. ✅ **Vercel Environment Variables**

   - Vercel dashboard'unuzda `HEARTBEAT_SECRET` environment variable'ının eklendiğinden emin olun
   - Production ortamında doğru token'ın kullanıldığını kontrol edin

3. ⏰ **İlk otomatik çalışmayı bekleyin**
   - Cron job planlanan zamanda otomatik çalışacak
   - cron-job.org dashboard'unda log'ları takip edebilirsiniz

### 📊 Monitoring

**cron-job.org dashboard'undan şunları takip edebilirsiniz:**

- ✅ **Son çalışma zamanı** - En son ne zaman tetiklendi
- ✅ **Status code** - 200 olmalı
- ✅ **Response time** - Genellikle 1-2 saniye arası
- ✅ **Error logs** - Hata varsa burada görünür

**Günlük kontrol edilmesi gerekenler:**

- ✅ Cron job düzenli çalışıyor mu?
- ✅ Status code 200 dönüyor mu?
- ✅ Response time normal mi? (50ms - 2sn arası normal)

### 🎯 Beklenen Sonuç

Her gün planlanan saatte cron job çalıştığında:

1. ✅ Endpoint'e istek atılır
2. ✅ Token doğrulanır
3. ✅ Supabase'e bağlanılır
4. ✅ Hafif bir sorgu çalıştırılır
5. ✅ Supabase aktif kalır
6. ✅ Status 200 döner

**Supabase artık ASLA uyku moduna girmeyecek!** ✨

### 🆘 Eğer Bir Sorun Olursa

cron-job.org dashboard'undaki log'lara bakın:

- **Status Code:** 200 olmalı
- **Response:** `{"ok":true,"timestamp":"...","count":13}` gibi olmalı
- **Error:** Varsa detayları burada görünür

---

**Tebrikler! Sistem tamamen kuruldu ve çalışıyor! 🚀**
