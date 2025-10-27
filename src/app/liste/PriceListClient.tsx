"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import { Phone, InstallmentCampaign } from "@/types";
import {
  getPhones,
  subscribeToPhones,
  getInstallmentCampaigns,
  subscribeToInstallmentCampaigns,
} from "@/lib/supabase";
import { calculatePrices, formatPrice } from "@/lib/priceCalculator";
import { getColorHex, colorNeedsBorder } from "@/lib/colorHelper";

// Banka hesap bilgileri
const bankAccounts = [
  {
    id: 1,
    bankName: "Kuveyt Türk",
    iban: "TR250020500009621365200001",
  },
];

export default function PriceListClient() {
  const [phones, setPhones] = useState<Phone[]>([]);
  const [installmentCampaigns, setInstallmentCampaigns] = useState<
    InstallmentCampaign[]
  >([]);
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
    let unsubscribePhones = () => {};
    let unsubscribeCampaigns = () => {};

    (async () => {
      try {
        // İlk yükleme
        const [phonesData, campaignsData] = await Promise.all([
          getPhones(),
          getInstallmentCampaigns(),
        ]);
        setPhones(phonesData);
        setInstallmentCampaigns(campaignsData);
        setLoading(false);

        // Real-time subscription - Telefonlar
        unsubscribePhones = subscribeToPhones((updater) => {
          setPhones((prev) => updater(prev));
        });

        // Real-time subscription - Taksit kampanyaları
        unsubscribeCampaigns = subscribeToInstallmentCampaigns((updater) => {
          setInstallmentCampaigns((prev) => updater(prev));
        });
      } catch (error) {
        console.error("Veriler yüklenirken hata:", error);
        setLoading(false);
      }
    })();

    // Yedek güncelleme - Her 30 saniyede bir
    const pollingInterval = setInterval(async () => {
      try {
        const [phonesData, campaignsData] = await Promise.all([
          getPhones(),
          getInstallmentCampaigns(),
        ]);
        setPhones(phonesData);
        setInstallmentCampaigns(campaignsData);
      } catch (error) {
        console.error("Yedek güncelleme hatası:", error);
      }
    }, 30000);

    // Sayfa focus olduğunda yenile
    const handleFocus = async () => {
      try {
        const [phonesData, campaignsData] = await Promise.all([
          getPhones(),
          getInstallmentCampaigns(),
        ]);
        setPhones(phonesData);
        setInstallmentCampaigns(campaignsData);
      } catch (error) {
        console.error("Focus güncelleme hatası:", error);
      }
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      unsubscribePhones();
      unsubscribeCampaigns();
      clearInterval(pollingInterval);
      window.removeEventListener("focus", handleFocus);
    };
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
        <div className="container mx-auto px-1 md:px-4">
          {/* Liste Container */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Liste Header */}
            <div className="bg-linear-to-r from-red-600 to-red-800 text-white p-2 md:p-2.5">
              <div className="flex items-start justify-between mb-1.5">
                {/* Sol: Logo */}
                <div className="flex items-center">
                  <Image
                    src="/logo-bg.jpeg"
                    alt="Derya İletişim - Konya Telefon Fiyat Listesi Logo"
                    width={60}
                    height={60}
                    className="object-contain rounded-lg md:w-[80px] md:h-[80px]"
                    loading="eager"
                    priority
                  />
                </div>

                {/* Sağ: Başlık ve Tarih */}
                <div className="text-right">
                  <h1 className="text-xs md:text-sm font-bold mb-0.5">
                    TOPTAN GÜNLÜK FİYAT LİSTESİ
                  </h1>
                  <p className="text-red-100 text-sm md:text-sm">
                    {currentDate}
                  </p>
                </div>
              </div>

              {/* Arama Çubuğu */}
              <div className="mt-1.5">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Marka veya model ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-2 py-1.5 pl-8 rounded-lg border-0 text-gray-100 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white text-sm md:px-4 md:py-2 md:pl-10 md:text-base"
                  />
                  <svg
                    className="absolute left-2 top-1.5 w-4 h-4 text-gray-200 md:left-3 md:top-2.5 md:w-5 md:h-5"
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
            <div className="p-0.5 md:p-3">
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              ) : filteredPhones.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">Telefon bulunamadı</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div
                      key={brand}
                      className="border border-red-500 rounded-lg overflow-hidden"
                    >
                      {/* Marka Başlığı */}
                      <div className="bg-linear-to-r from-gray-700 to-gray-500 px-2 py-1">
                        <h2 className="text-base md:text-lg font-bold text-white">
                          {brand}
                        </h2>
                      </div>

                      {/* Marka Modelleri Tablosu */}
                      <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                          <colgroup>
                            <col className="w-[35%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                            <col className="w-[15%]" />
                            <col className="w-[20%]" />
                          </colgroup>
                          <thead>
                            <tr className="bg-gray-100 border-b border-gray-300">
                              <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[10px] md:text-xs font-bold text-gray-700 uppercase">
                                Model
                              </th>
                              <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[10px] md:text-xs font-bold text-gray-700 uppercase">
                                Renk
                              </th>
                              <th className="px-1 py-1 md:px-2 md:py-1.5 text-right text-[10px] md:text-xs font-bold text-gray-700 uppercase">
                                <span className="md:hidden">Nakit</span>
                                <span className="hidden md:inline">Nakit</span>
                              </th>
                              <th className="px-1 py-1 md:px-2 md:py-1.5 text-right text-[10px] md:text-xs font-bold text-gray-700 uppercase">
                                <span className="md:hidden">Tek Çekim</span>
                                <span className="hidden md:inline">
                                  Tek Çekim
                                </span>
                              </th>
                              <th className="px-1 py-1 md:px-2 md:py-1.5 text-right text-[10px] md:text-xs font-bold text-gray-700 uppercase">
                                <span className="md:hidden">
                                  Kampanyalı Taksit
                                </span>
                                <span className="hidden md:inline">
                                  Kampanyalı Taksit
                                </span>
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
                                  className={`hover:bg-red-50 transition-colors ${
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }`}
                                >
                                  <td className="px-1 py-1 md:px-2 md:py-1.5 text-xs text-gray-900 font-medium">
                                    {phone.model}
                                  </td>
                                  <td className="px-1 py-1 md:px-2 md:py-1.5">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      {phone.colors.map((color) => (
                                        <span
                                          key={color}
                                          className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full shrink-0 ${
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
                                  <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-right text-xs font-semibold text-green-800">
                                    {formatPrice(prices.cash)}
                                  </td>
                                  <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-right text-xs font-semibold text-blue-800">
                                    {formatPrice(prices.singlePayment)}
                                  </td>
                                  <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-right text-xs font-semibold text-purple-800">
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

            {/* Taksit Bilgileri */}
            <div className="p-0.5 md:p-4 border-t border-gray-200">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 text-center">
                Taksit Bilgileri
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-red-500">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300">
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                          Banka Adı
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                          Taksit Açıklaması
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {installmentCampaigns.map((campaign) => (
                        <tr
                          key={campaign.id}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-3 py-2 text-xs font-medium text-gray-900">
                            {campaign.bank_name}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700">
                            {campaign.installment_description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {installmentCampaigns.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Henüz taksit bilgisi eklenmemiş</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hesap Numaralarımız */}
            <div className="p-0.5 md:p-4 border-t border-gray-200">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-3 text-center">
                Hesap Numaralarımız
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="bg-gray-50 rounded-lg overflow-hidden border border-red-500">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-200 border-b border-gray-300">
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                          Banka
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase">
                          IBAN
                        </th>
                        <th className="px-3 py-2 w-16"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bankAccounts.map((account) => (
                        <tr
                          key={account.id}
                          className="hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-3 py-2 text-xs font-medium text-gray-900">
                            {account.bankName}
                          </td>
                          <td className="px-3 py-2 text-xs text-gray-700 font-mono">
                            {account.iban}
                          </td>
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => copyToClipboard(account.iban)}
                              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-red-100 transition-colors relative group"
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
                                  className="w-5 h-5 text-red-600"
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
                <div className="text-center mt-1 p-2 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs font-semibold text-gray-800">
                    DERYA İNOVASYON
                  </p>
                </div>
                <p className="text-center text-xs text-gray-500 mt-2">
                  Havale/EFT yaparken açıklama kısmına ad-soyad ve telefon
                  numaranızı yazmayı unutmayın.
                </p>
              </div>
            </div>

            {/* Footer Bilgilendirme */}
            <div className="bg-gray-50 px-0.5 md:px-4 py-1 md:py-3 border-t border-gray-200">
              <div className="flex items-center text-xs text-gray-600">
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
                  <span className="font-semibold">+90 (507) 263 82 82</span>{" "}
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
