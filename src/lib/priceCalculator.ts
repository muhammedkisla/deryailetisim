import { CalculatedPrices } from "@/types";

/**
 * Nakit fiyattan diğer fiyatları hesaplar (Direkt Bölme)
 *
 * Mantık: Nakit fiyat = en düşük fiyat (baz fiyat)
 * Diğer fiyatlar = Nakit / Oran şeklinde hesaplanır
 *
 * @param cashPrice - Nakit fiyat (en düşük fiyat)
 * @param singlePaymentRate - Tek çekim oranı (örn: 0.97 = nakit/0.97 ile tek çekim bulunur)
 * @param installmentRate - Taksit oranı (örn: 0.93 = nakit/0.93 ile taksit bulunur)
 *
 * Örnek (Müşterinin verdiği örnek):
 * - Nakit: 100,000 TL
 * - Tek çekim: 100,000 / 0.97 = 103,093 TL (%3 daha pahalı)
 * - Taksit: 100,000 / 0.93 = 107,527 TL (%7 daha pahalı)
 */
export function calculatePrices(
  cashPrice: number,
  singlePaymentRate: number = 0.97,
  installmentRate: number = 0.93
): CalculatedPrices {
  return {
    cash: cashPrice,
    // Direkt bölme: Nakit / Oran
    singlePayment: Math.round(cashPrice / singlePaymentRate),
    installment: Math.round(cashPrice / installmentRate),
  };
}

/**
 * Fiyatı Türk Lirası formatında gösterir (TL işareti olmadan)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
