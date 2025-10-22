"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Phone } from "@/types";
import { mockPhones } from "@/lib/supabase";
import { calculatePrices, formatPrice } from "@/lib/priceCalculator";
import { getColorHex, colorNeedsBorder } from "@/lib/colorHelper";

// Banka hesap bilgileri
const bankAccounts = [
  {
    id: 1,
    bankName: "Ziraat Bankası",
    iban: "TR33 0001 0000 0000 0000 0000 01",
  },
  {
    id: 2,
    bankName: "İş Bankası",
    iban: "TR44 0006 4000 0000 0000 0000 02",
  },
  {
    id: 3,
    bankName: "Akbank",
    iban: "TR55 0004 6000 0000 0000 0000 03",
  },
  {
    id: 4,
    bankName: "Garanti BBVA",
    iban: "TR66 0006 2000 0000 0000 0000 04",
  },
];

export default function PriceListPage() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate] = useState(new Date().toLocaleDateString("tr-TR"));
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  const copyToClipboard = async (iban: string) => {
    try {
      await navigator.clipboard.writeText(iban.replace(/\s/g, ""));
      setCopiedIban(iban);
      setTimeout(() => setCopiedIban(null), 2000);
    } catch (err) {
      console.error("Kopyalama hatası:", err);
    }
  };

  useEffect(() => {
    const loadPhones = async () => {
      try {
        setPhones(mockPhones);
        setLoading(false);
      } catch (error) {
        console.error("Telefonlar yüklenirken hata:", error);
        setLoading(false);
      }
    };

    loadPhones();
  }, []);

  const filteredPhones = phones.filter(
    (phone) =>
      phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Telefonları markaya göre grupla
  const phonesByBrand = filteredPhones.reduce((acc, phone) => {
    if (!acc[phone.brand]) {
      acc[phone.brand] = [];
    }
    acc[phone.brand].push(phone);
    return acc;
  }, {} as Record<string, Phone[]>);

  // Özel sıralama: Apple, Samsung, Xiaomi öncelikli, diğerleri alfabetik
  const brands = Object.keys(phonesByBrand).sort((a, b) => {
    const priority = ["Apple", "Samsung", "Xiaomi"];
    const aIndex = priority.indexOf(a);
    const bIndex = priority.indexOf(b);

    // Her ikisi de öncelikli ise, priority sırasına göre
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    // Sadece a öncelikli ise
    if (aIndex !== -1) return -1;
    // Sadece b öncelikli ise
    if (bIndex !== -1) return 1;
    // Hiçbiri öncelikli değilse alfabetik sırala
    return a.localeCompare(b, "tr");
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="grow py-2">
        <div className="container mx-auto px-4">
          {/* Liste Container */}
          <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Liste Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-6">
              <div className="flex items-start justify-between mb-4">
                {/* Sol: Logo */}
                <div className="flex items-center">
                  <Image
                    src="/logo-bg.jpeg"
                    alt="Derya İletişim"
                    width={110}
                    height={110}
                    className="object-contain rounded-lg"
                  />
                </div>

                {/* Sağ: Başlık ve Tarih */}
                <div className="text-right">
                  <h1 className="text-sm md:text-md font-bold mb-1">
                    TOPTAN GÜNLÜK FİYAT LİSTESİ
                  </h1>
                  <p className="text-blue-100 text-lg">{currentDate}</p>
                </div>
              </div>

              {/* Arama Çubuğu */}
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Marka veya model ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 rounded-lg border-0 text-gray-100 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <svg
                    className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Liste İçeriği */}
            <div className="p-2 md:p-4">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredPhones.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">Telefon bulunamadı</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {brands.map((brand) => (
                    <div
                      key={brand}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Marka Başlığı */}
                      <div className="bg-linear-to-r from-gray-800 to-gray-700 px-3 py-3 md:px-4 md:py-3">
                        <h2 className="text-lg md:text-xl font-bold text-white">
                          {brand}
                        </h2>
                      </div>

                      {/* Marka Modelleri Tablosu */}
                      <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                          <colgroup>
                            <col className="w-[40%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                              <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">
                                Model
                              </th>
                              <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">
                                Renk
                              </th>
                              <th className="px-2 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-bold text-gray-700 uppercase">
                                Nakit
                              </th>
                              <th className="px-2 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-bold text-gray-700 uppercase">
                                Tek Çekim
                              </th>
                              <th className="px-2 py-2 md:px-4 md:py-3 text-right text-xs md:text-sm font-bold text-gray-700 uppercase">
                                Taksit
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {phonesByBrand[brand].map((phone, index) => {
                              const prices = calculatePrices(
                                phone.cashPrice,
                                phone.singlePaymentRate,
                                phone.installmentRate
                              );
                              return (
                                <tr
                                  key={phone.id}
                                  className={`hover:bg-blue-50 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }`}
                                >
                                  <td className="px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm text-gray-900 font-medium">
                                    {phone.model}
                                  </td>
                                  <td className="px-2 py-2 md:px-4 md:py-3">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {phone.colors.map((color) => (
                                        <span
                                          key={color}
                                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full shrink-0 ${
                                            colorNeedsBorder(color)
                                              ? "border border-gray-300"
                                              : ""
                                          }`}
                                          style={{
                                            background: getColorHex(color),
                                          }}
                                          title={color}
                                        ></span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-right text-xs md:text-sm font-semibold text-green-600">
                                    {formatPrice(prices.cash)}
                                  </td>
                                  <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-right text-xs md:text-sm font-semibold text-blue-600">
                                    {formatPrice(prices.singlePayment)}
                                  </td>
                                  <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-right text-xs md:text-sm font-semibold text-purple-600">
                                    {formatPrice(prices.installment)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hesap Numaralarımız */}
            <div className="p-2 md:p-6 border-t border-gray-200">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                Hesap Numaralarımız
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300">
                        <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">
                          Banka
                        </th>
                        <th className="px-3 py-3 md:px-6 md:py-4 text-left text-xs md:text-sm font-bold text-gray-700 uppercase">
                          IBAN
                        </th>
                        <th className="px-3 py-3 md:px-6 md:py-4 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bankAccounts.map((account) => (
                        <tr
                          key={account.id}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm font-medium text-gray-900">
                            {account.bankName}
                          </td>
                          <td className="px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-gray-700 font-mono">
                            {account.iban}
                          </td>
                          <td className="px-3 py-3 md:px-6 md:py-4 text-center">
                            <button
                              onClick={() => copyToClipboard(account.iban)}
                              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 transition-colors relative group"
                              title="IBAN'ı Kopyala"
                            >
                              {copiedIban === account.iban ? (
                                <svg
                                  className="w-5 h-5 text-green-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5 text-blue-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                              )}
                              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {copiedIban === account.iban
                                  ? "Kopyalandı!"
                                  : "Kopyala"}
                              </span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-center mt-1 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs md:text-sm font-semibold text-gray-800">
                    DERYA İLETİŞİM TEKNOLOJİ ÜRÜNLERİ VE ELEKTRONİK PAZARLAMA
                    TİC. LTD. ŞTİ
                  </p>
                </div>
                <p className="text-center text-xs md:text-sm text-gray-500 mt-3">
                  Havale/EFT yaparken açıklama kısmına ad-soyad ve telefon
                  numaranızı yazmayı unutmayın.
                </p>
              </div>
            </div>

            {/* Footer Bilgilendirme */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p>
                  Fiyatlar günlük olarak güncellenebilir. Kesin fiyat için{" "}
                  <span className="font-semibold">+90 (537) 347 08 88</span>{" "}
                  numaralı telefondan bizi arayabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
