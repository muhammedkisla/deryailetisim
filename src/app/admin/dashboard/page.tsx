"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "@/types";
import {
  getPhones,
  addPhone,
  updatePhone,
  deletePhone,
  subscribeToPhones,
} from "@/lib/supabase";
import { formatPrice, calculatePrices } from "@/lib/priceCalculator";
import { phoneColors, getColorHex, colorNeedsBorder } from "@/lib/colorHelper";

export default function AdminDashboard() {
  const router = useRouter();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    colors: [] as string[],
    cashPrice: "",
    singlePaymentRate: "1.05",
    installmentRate: "1.15",
    stock: true,
  });

  const loadPhones = async () => {
    const data = await getPhones();
    setPhones(data);
  };

  useEffect(() => {
    // Oturum kontrolü
    const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }

    // Telefonları yükle
    loadPhones();

    // Real-time subscription
    const subscription = subscribeToPhones((updatedPhones) => {
      setPhones(updatedPhones);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    router.push("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // En az bir renk seçilmiş mi kontrol et
    if (formData.colors.length === 0) {
      alert("Lütfen en az bir renk seçiniz!");
      return;
    }

    const phoneData = {
      brand: formData.brand,
      model: formData.model,
      colors: formData.colors,
      cashPrice: parseFloat(formData.cashPrice),
      singlePaymentRate: parseFloat(formData.singlePaymentRate),
      installmentRate: parseFloat(formData.installmentRate),
      stock: formData.stock,
    };

    if (editingPhone) {
      // Güncelleme
      const result = await updatePhone(editingPhone.id, phoneData);
      if (result) {
        alert("Telefon başarıyla güncellendi!");
      } else {
        alert("Telefon güncellenirken bir hata oluştu!");
      }
    } else {
      // Yeni ekleme
      const result = await addPhone(phoneData);
      if (result) {
        alert("Telefon başarıyla eklendi!");
      } else {
        alert("Telefon eklenirken bir hata oluştu!");
      }
    }

    // Formu sıfırla
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      brand: "",
      model: "",
      colors: [],
      cashPrice: "",
      singlePaymentRate: "1.05",
      installmentRate: "1.15",
      stock: true,
    });
    setIsAddingPhone(false);
    setEditingPhone(null);
  };

  const handleEdit = (phone: Phone) => {
    setEditingPhone(phone);
    setFormData({
      brand: phone.brand,
      model: phone.model,
      colors: phone.colors,
      cashPrice: phone.cashPrice.toString(),
      singlePaymentRate: phone.singlePaymentRate.toString(),
      installmentRate: phone.installmentRate.toString(),
      stock: phone.stock,
    });
    setIsAddingPhone(true);

    // Formu açtıktan sonra yukarı kaydır
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Renk seçimi handler
  const handleColorToggle = (colorName: string) => {
    setFormData((prev) => {
      const colors = prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName];
      return { ...prev, colors };
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu telefonu silmek istediğinizden emin misiniz?")) {
      const result = await deletePhone(id);
      if (result) {
        alert("Telefon başarıyla silindi!");
      } else {
        alert("Telefon silinirken bir hata oluştu!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Yönetim Paneli
              </h1>
              <p className="text-sm text-gray-600">Derya İletişim</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* İstatistikler */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Toplam Ürün</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  {phones.length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Stokta Var</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">
                  {phones.filter((p) => p.stock).length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs md:text-sm">Stokta Yok</p>
                <p className="text-xl md:text-2xl font-bold text-red-600">
                  {phones.filter((p) => !p.stock).length}
                </p>
              </div>
              <div className="bg-red-100 p-2 rounded-lg">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Yeni Ürün Ekleme Butonu */}
        {!isAddingPhone && (
          <div className="mb-6 items-center justify-center flex">
            <button
              onClick={() => {
                setIsAddingPhone(true);
                // Formu açtıktan sonra yukarı kaydır
                setTimeout(() => {
                  formRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 100);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Yeni Telefon Ekle</span>
            </button>
          </div>
        )}

        {/* Ürün Ekleme/Düzenleme Formu */}
        {isAddingPhone && (
          <div ref={formRef} className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPhone ? "Telefonu Düzenle" : "Yeni Telefon Ekle"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Apple, Samsung, Xiaomi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model (Tam Model İsmi) *
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="iPhone 15 Pro Max 256GB"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Renkler * (En az 1 renk seçiniz)
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-1.5 md:gap-2">
                    {phoneColors.map((color) => (
                      <label
                        key={color.name}
                        className={`flex items-center gap-1.5 p-1.5 md:p-2 border rounded-lg cursor-pointer transition-all ${
                          formData.colors.includes(color.name)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.colors.includes(color.name)}
                          onChange={() => handleColorToggle(color.name)}
                          className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`w-4 h-4 md:w-5 md:h-5 rounded-full shrink-0 ${
                            colorNeedsBorder(color.name)
                              ? "border border-gray-300"
                              : ""
                          }`}
                          style={{ background: getColorHex(color.name) }}
                        ></span>
                        <span className="text-[10px] md:text-xs text-gray-700 truncate leading-tight">
                          {color.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.colors.length === 0 && (
                    <p className="mt-2 text-sm text-red-600">
                      Lütfen en az bir renk seçiniz
                    </p>
                  )}
                </div>
              </div>

              {/* Fiyat Bilgileri - Ayrı Bölüm */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  💰 Fiyat Bilgileri
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nakit Fiyat (₺) *
                    </label>
                    <input
                      type="number"
                      value={formData.cashPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, cashPrice: e.target.value })
                      }
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="65000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tek Çekim Oranı *
                    </label>
                    <input
                      type="number"
                      value={formData.singlePaymentRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          singlePaymentRate: e.target.value,
                        })
                      }
                      required
                      min="1"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="1.05"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Örn: 1.05 = %5 fazla
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taksit Oranı *
                    </label>
                    <input
                      type="number"
                      value={formData.installmentRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installmentRate: e.target.value,
                        })
                      }
                      required
                      min="1"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="1.15"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Örn: 1.15 = %15 fazla
                    </p>
                  </div>
                </div>
              </div>

              {/* Fiyat Önizlemesi */}
              {formData.cashPrice && (
                <div className="bg-gray-50 p-4 rounded-lg -mt-3">
                  <h3 className="font-semibold text-gray-800 mb-3">
                    Fiyat Önizlemesi:
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Nakit</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatPrice(parseFloat(formData.cashPrice))}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tek Çekim</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatPrice(
                          parseFloat(formData.cashPrice) *
                            parseFloat(formData.singlePaymentRate)
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Taksitli</p>
                      <p className="text-lg font-bold text-purple-600">
                        {formatPrice(
                          parseFloat(formData.cashPrice) *
                            parseFloat(formData.installmentRate)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="stock"
                  checked={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="stock"
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  Stokta Var
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  {editingPhone ? "Güncelle" : "Ekle"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ürün Listesi */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-xl font-bold text-gray-800">
                Telefon Listesi
              </h2>

              {/* Arama Çubuğu */}
              <div className="relative flex-1 md:max-w-md">
                <input
                  type="text"
                  placeholder="Marka veya model ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
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

          {phones.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Henüz telefon eklenmemiş
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Yeni telefon ekleyerek başlayın.
              </p>
            </div>
          ) : (
            <div className="p-2 md:p-4 space-y-4">
              {(() => {
                // Telefonları filtrele
                const filteredPhones = phones.filter(
                  (phone) =>
                    phone.brand
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    phone.model.toLowerCase().includes(searchTerm.toLowerCase())
                );

                // Filtrelenmiş telefonları markaya göre grupla
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

                  if (aIndex !== -1 && bIndex !== -1) {
                    return aIndex - bIndex;
                  }
                  if (aIndex !== -1) return -1;
                  if (bIndex !== -1) return 1;
                  return a.localeCompare(b, "tr");
                });

                // Filtreleme sonucu telefon bulunamadıysa
                if (filteredPhones.length === 0) {
                  return (
                    <div className="text-center py-20">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
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
                      <p className="mt-4 text-gray-500 text-lg">
                        Telefon bulunamadı
                      </p>
                      <p className="mt-2 text-gray-400 text-sm">
                        &quot;{searchTerm}&quot; araması için sonuç yok
                      </p>
                    </div>
                  );
                }

                return brands.map((brand) => (
                  <div
                    key={brand}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Marka Başlığı */}
                    <div className="bg-linear-to-r from-gray-600 to-gray-700 px-2 py-2 md:px-4 md:py-3">
                      <h3 className="text-base md:text-lg font-bold text-white">
                        {brand}
                      </h3>
                    </div>

                    {/* Marka Modelleri Tablosu */}
                    <div className="overflow-x-auto">
                      <table className="w-full table-fixed">
                        <colgroup>
                          <col className="w-[25%]" />
                          <col className="w-[12%]" />
                          <col className="w-[13%]" />
                          <col className="w-[13%]" />
                          <col className="w-[13%]" />
                          <col className="w-[8%]" />
                          <col className="w-[16%]" />
                        </colgroup>
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              Model
                            </th>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              Renk
                            </th>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              Nakit
                            </th>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              Tek Çekim
                            </th>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-left text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              Taksit
                            </th>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-center text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              Stok
                            </th>
                            <th className="px-2 py-2 md:px-4 md:py-3 text-right text-xs md:text-xs font-medium text-gray-500 uppercase tracking-tight md:tracking-wider">
                              İşlemler
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
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
                                <td className="px-2 py-2 md:px-4 md:py-3 text-xs md:text-sm font-medium text-gray-900">
                                  {phone.model}
                                </td>
                                <td className="px-2 py-2 md:px-4 md:py-3">
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {phone.colors.map((color) => (
                                      <span
                                        key={color}
                                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full shrink-0 ${
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
                                <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm font-semibold text-green-600">
                                  {formatPrice(prices.cash)}
                                </td>
                                <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm font-semibold text-blue-600">
                                  {formatPrice(prices.singlePayment)}
                                </td>
                                <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-xs md:text-sm font-semibold text-purple-600">
                                  {formatPrice(prices.installment)}
                                </td>
                                <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-center">
                                  {phone.stock ? (
                                    <span className="px-1 md:px-2 inline-flex text-[10px] md:text-xs leading-4 md:leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                      Var
                                    </span>
                                  ) : (
                                    <span className="px-1 md:px-2 inline-flex text-[10px] md:text-xs leading-4 md:leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                      Yok
                                    </span>
                                  )}
                                </td>
                                <td className="px-2 py-2 md:px-4 md:py-3 whitespace-nowrap text-right text-xs md:text-sm font-medium">
                                  <button
                                    onClick={() => handleEdit(phone)}
                                    className="text-blue-600 hover:text-blue-900 mr-2 md:mr-3 font-medium"
                                  >
                                    Düzenle
                                  </button>
                                  <button
                                    onClick={() => handleDelete(phone.id)}
                                    className="text-red-600 hover:text-red-900 font-medium"
                                  >
                                    Sil
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>

        {/* Bilgilendirme */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 mr-3"
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
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Önemli Bilgiler:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Nakit fiyat girdikten sonra diğer fiyatlar otomatik hesaplanır
                </li>
                <li>
                  Tek çekim ve taksit oranlarını ihtiyacınıza göre
                  ayarlayabilirsiniz
                </li>
                <li>
                  Şu an veriler geçici olarak tutulmaktadır. Supabase
                  entegrasyonu sonrası kalıcı olacaktır.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
