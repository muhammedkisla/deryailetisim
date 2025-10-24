"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Phone } from "@/types";
import {
  getAllPhones,
  addPhone,
  updatePhone,
  deletePhone,
  subscribeToAllPhones,
  supabase,
} from "@/lib/supabase";
import { formatPrice, calculatePrices } from "@/lib/priceCalculator";
import { phoneColors, getColorHex, colorNeedsBorder } from "@/lib/colorHelper";
import Toast, { ToastType } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminDashboard() {
  const router = useRouter();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  // Form state
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    colors: [] as string[],
    cashPrice: "",
    singlePaymentRate: "0.97",
    installmentRate: "0.93",
    installmentCampaign: "",
    stock: true,
  });

  const formatThousandsTR = (raw: string) => {
    if (!raw) return "";
    const digitsOnly = raw.replace(/\D/g, "");
    return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const normalizeRateInput = (raw: string) => {
    if (!raw) return "";
    const withDot = raw.replace(/,/g, ".");
    const cleaned = withDot.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length <= 1) return cleaned;
    const first = parts.shift() as string;
    const decimal = parts.join("").substring(0, 4); // Max 4 ondalık basamak
    return `${first}.${decimal}`;
  };

  const loadPhones = async () => {
    const data = await getAllPhones();
    setPhones(data);
  };

  const resetForm = useCallback(() => {
    setFormData({
      brand: "",
      model: "",
      colors: [],
      cashPrice: "",
      singlePaymentRate: "0.97",
      installmentRate: "0.93",
      installmentCampaign: "",
      stock: true,
    });
    setIsAddingPhone(false);
    setEditingPhone(null);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let unsubscribe: (() => void) | null = null;

    // Supabase Auth kontrolü
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Session storage kontrolü (eski sistemle uyumluluk)
        const isLoggedIn = sessionStorage.getItem("isAdminLoggedIn");
        if (!isLoggedIn) {
          router.push("/admin/login");
          return;
        }
      }

      // Telefonları yükle
      timeoutId = setTimeout(() => {
        loadPhones();
      }, 0);

      // Real-time subscription - Admin için tüm telefonları göster
      unsubscribe = subscribeToAllPhones((updater) => {
        setPhones((prev) => {
          const updated = updater(prev);

          // Eğer düzenlenen telefon silinmişse, güncelleme formunu kapat
          if (editingPhone && !updated.find((p) => p.id === editingPhone.id)) {
            setEditingPhone(null);
            setIsAddingPhone(false);
            resetForm();
          }

          return updated;
        });
      });
    };

    checkAuth();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (unsubscribe) unsubscribe();
    };
  }, [router, editingPhone, resetForm]);

  const handleLogout = async () => {
    // Supabase'den çıkış yap
    await supabase.auth.signOut();

    // Session storage'ı temizle
    sessionStorage.removeItem("isAdminLoggedIn");

    // Login sayfasına yönlendir
    router.push("/admin/login");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marka ve model boş mu kontrol et
    if (!formData.brand.trim()) {
      showToast("Lütfen marka adını giriniz!", "error");
      return;
    }

    if (!formData.model.trim()) {
      showToast("Lütfen model adını giriniz!", "error");
      return;
    }

    // En az bir renk seçilmiş mi kontrol et
    if (formData.colors.length === 0) {
      showToast("Lütfen en az bir renk seçiniz!", "error");
      return;
    }

    setIsSubmitting(true);

    const cashPriceNumber = Number(formData.cashPrice.replace(/\./g, ""));
    const singleRateNum = parseFloat(
      (formData.singlePaymentRate || "").replace(/,/g, ".")
    );
    const installmentRateNum = parseFloat(
      (formData.installmentRate || "").replace(/,/g, ".")
    );

    // Marka adını büyük harf yap
    const upperCaseBrand = formData.brand.trim().toUpperCase();

    const phoneData = {
      brand: upperCaseBrand,
      model: formData.model.trim(),
      colors: formData.colors,
      cashPrice: cashPriceNumber,
      singlePaymentRate: singleRateNum,
      installmentRate: installmentRateNum,
      installmentCampaign: formData.installmentCampaign.trim() || undefined,
      stock: formData.stock,
    };

    if (editingPhone) {
      // Düzenlenen telefon hala mevcut mu kontrol et
      const phoneExists = phones.find((p) => p.id === editingPhone.id);
      if (!phoneExists) {
        showToast("Bu telefon artık mevcut değil!", "error");
        resetForm();
        return;
      }

      // Güncelleme
      const result = await updatePhone(editingPhone.id, phoneData);
      if (result) {
        showToast("Telefon başarıyla güncellendi!", "success");
        // Real-time subscription otomatik güncelleyecek, ama yedek olarak manuel güncelle
        setTimeout(() => {
          loadPhones();
        }, 500);
      } else {
        showToast("Telefon güncellenirken bir hata oluştu!", "error");
      }
    } else {
      // Yeni ekleme
      const result = await addPhone(phoneData);
      if (result) {
        showToast("Telefon başarıyla eklendi!", "success");
        // Real-time subscription otomatik ekleyecek, ama yedek olarak manuel güncelle
        setTimeout(() => {
          loadPhones();
        }, 500);
      } else {
        showToast("Telefon eklenirken bir hata oluştu!", "error");
      }
    }

    setIsSubmitting(false);
    // Formu sıfırla
    resetForm();
  };

  const handleEdit = (phone: Phone) => {
    setEditingPhone(phone);
    setFormData({
      brand: phone.brand,
      model: phone.model,
      colors: phone.colors,
      cashPrice: phone.cashPrice.toString(),
      singlePaymentRate: String(phone.singlePaymentRate),
      installmentRate: String(phone.installmentRate),
      installmentCampaign: phone.installmentCampaign || "",
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
    setConfirmDialog({
      title: "Telefonu Sil",
      message:
        "Bu telefonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
      onConfirm: async () => {
        setConfirmDialog(null);
        const result = await deletePhone(id);
        if (result) {
          showToast("Telefon başarıyla silindi!", "success");
          // Real-time subscription otomatik kaldıracak, ama yedek olarak manuel güncelle
          setTimeout(() => {
            loadPhones();
          }, 500);
        } else {
          showToast("Telefon silinirken bir hata oluştu!", "error");
        }
      },
    });
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

      <main className="container mx-auto px-0.5 md:px-4 py-1 md:py-8">
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold transition-colors flex items-center space-x-2 shadow-lg"
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
              <span className="text-base">Yeni Telefon Ekle</span>
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
                      setFormData({
                        ...formData,
                        brand: e.target.value.toUpperCase(),
                      })
                    }
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="APPLE, SAMSUNG, XIAOMI..."
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
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1">
                    {phoneColors.map((color) => (
                      <label
                        key={color.name}
                        className={`flex items-center gap-1 p-1 border rounded cursor-pointer transition-all ${
                          formData.colors.includes(color.name)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.colors.includes(color.name)}
                          onChange={() => handleColorToggle(color.name)}
                          className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${
                            colorNeedsBorder(color.name)
                              ? "border border-gray-300"
                              : ""
                          }`}
                          style={{ background: getColorHex(color.name) }}
                        ></span>
                        <span className="text-[9px] text-gray-700 truncate leading-tight">
                          {color.name}
                        </span>
                      </label>
                    ))}
                  </div>
                  {formData.colors.length === 0 && (
                    <p className="mt-2 text-sm text-red-800">
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
                      inputMode="numeric"
                      value={formatThousandsTR(formData.cashPrice)}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cashPrice: e.target.value,
                        })
                      }
                      onBlur={(e) =>
                        setFormData({
                          ...formData,
                          cashPrice: formatThousandsTR(e.target.value),
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="65.000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tek Çekim Oranı *
                    </label>
                    <input
                      inputMode="decimal"
                      value={formData.singlePaymentRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          singlePaymentRate: normalizeRateInput(e.target.value),
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="0,97 veya 0,975 (max 4 ondalık)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Taksit Oranı *
                    </label>
                    <input
                      inputMode="decimal"
                      value={formData.installmentRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installmentRate: normalizeRateInput(e.target.value),
                        })
                      }
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="0,93 veya 0,925 (max 4 ondalık)"
                    />
                  </div>
                </div>
              </div>

              {/* Fiyat Önizlemesi */}
              {formData.cashPrice && (
                <div className="bg-linear-to-r from-gray-50 to-blue-50 p-4 rounded-lg -mt-3 border border-blue-100">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>📊</span> Fiyat Önizlemesi
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Nakit</p>
                      <p className="text-lg md:text-xl font-bold text-green-800">
                        {formatPrice(
                          Number((formData.cashPrice || "").replace(/\./g, ""))
                        )}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">Tek Çekim</p>

                      <p className="text-lg md:text-xl font-bold text-blue-800">
                        {formatPrice(
                          Math.round(
                            Number(
                              (formData.cashPrice || "").replace(/\./g, "")
                            ) /
                              parseFloat(
                                (formData.singlePaymentRate || "").replace(
                                  /,/g,
                                  "."
                                )
                              )
                          )
                        )}
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-500 mb-1">
                        Taksitli fiyat
                      </p>

                      <p className="text-lg md:text-xl font-bold text-purple-800">
                        {formatPrice(
                          Math.round(
                            Number(
                              (formData.cashPrice || "").replace(/\./g, "")
                            ) /
                              parseFloat(
                                (formData.installmentRate || "").replace(
                                  /,/g,
                                  "."
                                )
                              )
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Taksit Kampanya Bilgisi Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  💳 Taksit Kampanya Bilgisi (Opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.installmentCampaign}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      installmentCampaign: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="NOT: Banka adı - taksit sayısı aralarına VİRGÜL koymak önemli!   Örn: Ziraat 4-6-12, Kuveyt 5"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Hangi bankaların kartlarıyla kaç taksit yapılabileceğini
                  belirtin (Örn: &quot;Ziraat 4-6-12, Kuveyt 5&quot;)
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  NOT: Banka adı - taksit sayısı aralarına VİRGÜL koymak önemli!
                </p>
              </div>

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

              <div className="flex space-x-3 md:space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {isSubmitting
                    ? "İşleniyor..."
                    : editingPhone
                    ? "Güncelle"
                    : "Ekle"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-7 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ürün Listesi */}
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-0.5 md:px-4 py-1 md:py-4 border-b border-gray-200">
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
            <div className="p-0.5 md:p-3 space-y-2">
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
                    <div className="bg-linear-to-r from-gray-600 to-gray-700 px-2 py-1.5">
                      <h3 className="text-sm md:text-base font-bold text-white">
                        {brand}
                      </h3>
                    </div>

                    {/* Marka Modelleri Tablosu */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        {/* Mobil: 7 sütun (Stok gizli), Desktop: 8 sütun */}
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[22%] md:w-[20%]">
                              Model
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[12%] md:w-[10%]">
                              Renk
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[13%] md:w-[11%]">
                              Nakit
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[13%] md:w-[11%]">
                              <span className="md:hidden">Tek Çekim</span>
                              <span className="hidden md:inline">
                                Tek Çekim
                              </span>
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[14%] md:w-[12%]">
                              <span className="md:hidden">KMPNY</span>
                              <span className="hidden md:inline">Kampanya</span>
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-left text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[13%] md:w-[11%]">
                              <span className="md:hidden">Taksit</span>
                              <span className="hidden md:inline">Taksit</span>
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-center text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight hidden md:table-cell">
                              Stok
                            </th>
                            <th className="px-1 py-1 md:px-2 md:py-1.5 text-right text-[9px] md:text-xs font-medium text-gray-500 uppercase tracking-tight w-[13%] md:w-[18%]">
                              <span className="hidden md:inline">İşlemler</span>
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
                                } ${
                                  phone.stock
                                    ? "border-r-2 border-r-green-500 md:border-r-0"
                                    : "border-r-2 border-r-red-500 md:border-r-0"
                                }`}
                              >
                                <td className="px-1 py-1 md:px-2 md:py-1.5 text-xs font-medium text-gray-900">
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
                                <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-xs font-semibold text-green-800">
                                  {formatPrice(prices.cash)}
                                </td>
                                <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-xs font-semibold text-blue-800">
                                  {formatPrice(prices.singlePayment)}
                                </td>
                                <td className="px-1 py-1 md:px-2 md:py-1.5">
                                  {phone.installmentCampaign ? (
                                    <div className="text-[10px] leading-tight text-blue-700">
                                      {phone.installmentCampaign
                                        .split(",")
                                        .map((item, idx) => (
                                          <div
                                            key={idx}
                                            className="bg-blue-50 px-1 py-0.5 mb-0.5 rounded border border-blue-200 inline-block mr-1"
                                          >
                                            {item.trim()}
                                          </div>
                                        ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400 italic text-xs">
                                      -
                                    </span>
                                  )}
                                </td>
                                <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-xs font-semibold text-purple-800">
                                  {formatPrice(prices.installment)}
                                </td>
                                <td className="px-1 py-1 md:px-2 md:py-1.5 whitespace-nowrap text-center hidden md:table-cell">
                                  {phone.stock ? (
                                    <span className="px-1 md:px-1.5 inline-flex text-[9px] md:text-[10px] leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                                      Var
                                    </span>
                                  ) : (
                                    <span className="px-1 md:px-1.5 inline-flex text-[9px] md:text-[10px] leading-4 font-semibold rounded-full bg-red-100 text-red-800">
                                      Yok
                                    </span>
                                  )}
                                </td>
                                <td className="px-0.5 py-1 md:px-2 md:py-1.5 text-right text-[10px] md:text-xs font-medium">
                                  <div className="flex flex-col md:flex-row md:justify-end gap-1.5 md:gap-2">
                                    <button
                                      onClick={() => handleEdit(phone)}
                                      className="text-blue-600 hover:text-blue-900 font-medium py-1"
                                    >
                                      Düzenle
                                    </button>
                                    <button
                                      onClick={() => handleDelete(phone.id)}
                                      className="text-red-600 hover:text-red-900 font-medium py-1"
                                    >
                                      Sil
                                    </button>
                                  </div>
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
      </main>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmText="Evet, Sil"
          cancelText="İptal"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
          type="danger"
        />
      )}
    </div>
  );
}
