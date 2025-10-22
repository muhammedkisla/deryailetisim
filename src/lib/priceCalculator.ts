import { CalculatedPrices } from "@/types";

/**
 * Nakit fiyattan diğer fiyatları hesaplar
 * @param cashPrice - Nakit fiyat
 * @param singlePaymentRate - Tek çekim oranı (örn: 1.05 = %5 fazla)
 * @param installmentRate - Taksit oranı (örn: 1.15 = %15 fazla)
 */
export function calculatePrices(
  cashPrice: number,
  singlePaymentRate: number = 1.05,
  installmentRate: number = 1.15
): CalculatedPrices {
  return {
    cash: cashPrice,
    singlePayment: Math.round(cashPrice * singlePaymentRate),
    installment: Math.round(cashPrice * installmentRate),
  };
}

/**
 * Fiyatı Türk Lirası formatında gösterir
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
