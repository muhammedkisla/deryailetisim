# 📊 Fiyat Hesaplama Mantığı (Direkt Bölme)

## 🎯 Temel Mantık

**Nakit fiyat = En düşük fiyattır (baz fiyat)**

Diğer fiyatlar nakit fiyat üzerinden **direkt bölme** ile bulunur.

## 📐 Formül

```
Tek Çekim Fiyatı = Nakit Fiyat / Tek Çekim Oranı
Taksit Fiyatı    = Nakit Fiyat / Taksit Oranı
```

## 💡 Müşterinin Verdiği Örnek

Müşteri bize şu hesaplamayı gösterdi:

```
100 / 0.93 = 107,526882
```

"Taksit %7 ama şöyle 100 bin de üzerine eklenen yukarıdaki işlem gibi %7 Taksitte aşağıdan yukarıya mevzusu var tam gelmesi için bu şekilde hesaplanıyor."

**Yorum:** Müşteri zihinsel olarak:

- Nakit fiyatı (baz fiyat) alır
- Bu fiyatı **0.93** gibi bir orana bölerek taksit fiyatını bulur
- 0.93 = 1 - 0.07 (yani %7 fark)

## 📊 Örnek 1: İPhone 15 Pro

```
Nakit Fiyat: 100,000 TL
Tek Çekim Oranı: 0.97 (nakit/0.97 = %3 pahalı)
Taksit Oranı: 0.93 (nakit/0.93 = %7 pahalı)

Tek Çekim = 100,000 / 0.97 = 103,093 TL
Taksit    = 100,000 / 0.93 = 107,527 TL

✅ Sonuç:
- Nakit: 100,000 TL (baz fiyat)
- Tek Çekim: 103,093 TL (%3.09 daha pahalı)
- Taksit: 107,527 TL (%7.53 daha pahalı)
```

## 📊 Örnek 2: Samsung Galaxy S24

```
Nakit Fiyat: 65,000 TL
Tek Çekim Oranı: 0.97
Taksit Oranı: 0.93

Tek Çekim = 65,000 / 0.97 = 67,010 TL
Taksit    = 65,000 / 0.93 = 69,892 TL

✅ Sonuç:
- Nakit: 65,000 TL
- Tek Çekim: 67,010 TL
- Taksit: 69,892 TL
```

## 🔄 Kullanıcı Input Yaklaşımı

Kullanıcı için iki yaklaşım düşünüldü:

### ❌ Yaklaşım 1: Fark Oranı (0.03, 0.07)

```
Input: 0.03 (% fark)
Formül: Nakit / (1 - 0.03) = Nakit / 0.97

❌ Sorun:
- Kullanıcı kafasında "100 / 0.93" şeklinde düşünüyor
- 0.03 girmek → 0.97'ye dönüştürmek ekstra bir adım
- Kullanıcının zihinsel modeliyle uyumsuz
```

### ✅ Yaklaşım 2: Direkt Oran (0.97, 0.93) - SEÇİLEN

```
Input: 0.93 (bölen)
Formül: Nakit / 0.93

✅ Avantaj:
- Kullanıcının zihinsel modeliyle birebir uyumlu
- "100 / 0.93" örneğiyle tam eşleşiyor
- Daha sezgisel ve anlaşılır
- Direkt bölme işlemi
```

## 🧪 Test Senaryoları

### Test 1: Düşük Fark (%1 ve %3)

```
Nakit: 50,000 TL
Tek Çekim Oranı: 0.99 (bölen) → %1 fark
Taksit Oranı: 0.97 (bölen) → %3 fark

Tek Çekim = 50,000 / 0.99 = 50,505 TL
Taksit    = 50,000 / 0.97 = 51,546 TL
```

### Test 2: Yüksek Fark (%5 ve %10)

```
Nakit: 80,000 TL
Tek Çekim Oranı: 0.95 (bölen) → %5 fark
Taksit Oranı: 0.90 (bölen) → %10 fark

Tek Çekim = 80,000 / 0.95 = 84,211 TL
Taksit    = 80,000 / 0.90 = 88,889 TL
```

### Test 3: Varsayılan Oranlar

```
Nakit: 120,000 TL
Tek Çekim Oranı: 0.97 (bölen) → %3 fark (varsayılan)
Taksit Oranı: 0.93 (bölen) → %7 fark (varsayılan)

Tek Çekim = 120,000 / 0.97 = 123,711 TL
Taksit    = 120,000 / 0.93 = 129,032 TL
```

## 🗃️ Veritabanı İmplementasyonu

Supabase `phones` tablosunda **computed columns** kullanılıyor:

```sql
single_payment_price DECIMAL(10,2)
  GENERATED ALWAYS AS (ROUND(cash_price / single_payment_rate, 2)) STORED

installment_price DECIMAL(10,2)
  GENERATED ALWAYS AS (ROUND(cash_price / installment_rate, 2)) STORED
```

**Varsayılan Değerler:**

```sql
single_payment_rate DECIMAL(4,2) NOT NULL DEFAULT 0.97
installment_rate DECIMAL(4,2) NOT NULL DEFAULT 0.93
```

**Avantajlar:**

- ✅ Fiyatlar otomatik hesaplanır
- ✅ Veri tutarlılığı garantisi
- ✅ Client-side hesaplama yükü yok
- ✅ Her UPDATE'te otomatik güncellenir
- ✅ Müşterinin zihinsel modeliyle uyumlu

## 💻 Kod İmplementasyonu

### TypeScript (`priceCalculator.ts`)

```typescript
/**
 * Nakit fiyattan diğer fiyatları hesaplar (Direkt Bölme)
 *
 * @param cashPrice - Nakit fiyat (en düşük fiyat)
 * @param singlePaymentRate - Tek çekim oranı (örn: 0.97 = nakit/0.97)
 * @param installmentRate - Taksit oranı (örn: 0.93 = nakit/0.93)
 */
export function calculatePrices(
  cashPrice: number,
  singlePaymentRate: number = 0.97,
  installmentRate: number = 0.93
): CalculatedPrices {
  return {
    cash: cashPrice,
    singlePayment: Math.round(cashPrice / singlePaymentRate),
    installment: Math.round(cashPrice / installmentRate),
  };
}
```

## 📝 Kullanıcı Arayüzü

Admin Dashboard'da:

```
Nakit Fiyat: 100000 TL
Tek Çekim Oranı: 0.97 (Nakit / 0.97)
Taksit Oranı: 0.93 (Nakit / 0.93)

📊 Fiyat Önizlemesi:
- Nakit: 100.000₺ (En Düşük)
- Tek Çekim: 103.093₺ (+%3)
- Taksit: 107.527₺ (+%7)
```

## 🔐 Validation

Input alanları için:

- `min="0.01"` - 0'a bölme hatası engellensin (minimum 0.01)
- `max="1"` - Maksimum 1 (yani nakit fiyatın kendisi)
- `step="0.01"` - 0.01 artışlarla hassasiyet
- `required` - Boş bırakılmasın

**Not:** `min="0.01"` kritik! 0'a bölme hatası programı çökertir.

## 🎓 Özet

| Özellik                  | Değer                         |
| ------------------------ | ----------------------------- |
| **Baz Fiyat**            | Nakit fiyat (en düşük)        |
| **Formül**               | `Nakit / Oran` (direkt bölme) |
| **Tek Çekim Varsayılan** | 0.97 (bölen) → %3 fark        |
| **Taksit Varsayılan**    | 0.93 (bölen) → %7 fark        |
| **Hesaplama Yeri**       | Supabase (computed columns)   |
| **Real-time Güncelleme** | ✅ Aktif                      |
| **Kullanıcı Deneyimi**   | ✅ Müşteri örneğiyle uyumlu   |

## 🔄 Oran ve Yüzde Dönüşümü

| Fark Yüzdesi | Bölen (Input) | Hesaplama                |
| ------------ | ------------- | ------------------------ |
| %1           | 0.99          | 100,000 / 0.99 = 101,010 |
| %3           | 0.97          | 100,000 / 0.97 = 103,093 |
| %5           | 0.95          | 100,000 / 0.95 = 105,263 |
| %7           | 0.93          | 100,000 / 0.93 = 107,527 |
| %10          | 0.90          | 100,000 / 0.90 = 111,111 |

**Formül:** Bölen = 1 - (Fark Yüzdesi / 100)

---

**Son güncelleme:** 23 Ekim 2025  
**Durum:** Aktif ve çalışır durumda ✅  
**Yaklaşım:** Direkt Bölme (Müşteri örneğine uygun) ✅
