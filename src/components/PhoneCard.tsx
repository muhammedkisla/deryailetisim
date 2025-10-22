import { Phone } from "@/types";
import { calculatePrices, formatPrice } from "@/lib/priceCalculator";

interface PhoneCardProps {
  phone: Phone;
}

export default function PhoneCard({ phone }: PhoneCardProps) {
  const prices = calculatePrices(
    phone.cashPrice,
    phone.singlePaymentRate,
    phone.installmentRate
  );

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="bg-linear-to-r from-blue-500 to-blue-600 p-4">
        <h3 className="text-xl font-bold text-white">{phone.brand}</h3>
        <p className="text-blue-100">{phone.model}</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {/* Nakit Fiyat */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Nakit Fiyat:</span>
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(prices.cash)}
            </span>
          </div>

          {/* Tek Çekim */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Tek Çekim:</span>
            <span className="text-xl font-semibold text-blue-600">
              {formatPrice(prices.singlePayment)}
            </span>
          </div>

          {/* Taksitli */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Taksitli:</span>
            <span className="text-xl font-semibold text-purple-600">
              {formatPrice(prices.installment)}
            </span>
          </div>
        </div>

        {/* Stok Durumu */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          {phone.stock ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Stokta Var
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Stokta Yok
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
