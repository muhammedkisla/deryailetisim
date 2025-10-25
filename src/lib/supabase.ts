// Supabase client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL veya Anon Key eksik! .env.local dosyasını kontrol edin."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase Database Functions
import { Phone, InstallmentCampaign } from "@/types";

// Supabase'den gelen ham veri tipi
interface DbPhone {
  id: string;
  brand: string;
  model: string;
  colors: string[];
  cash_price: string | number;
  single_payment_rate: string | number;
  installment_rate: string | number;
  installment_campaign?: string;
  // Computed columns (STORED) - Veritabanında otomatik hesaplanır
  single_payment_price?: string | number;
  installment_price?: string | number;
  image_url?: string;
  stock: boolean;
  created_at: string;
  updated_at: string;
}

// Supabase veritabanı verisini TypeScript formatına dönüştür
// Supabase numeric/decimal alanları string döndürür, Number() ile dönüştürüyoruz
function mapDbPhone(item: DbPhone): Phone {
  return {
    id: item.id,
    brand: item.brand,
    model: item.model,
    colors: item.colors,
    cashPrice: Number(item.cash_price),
    singlePaymentRate: Number(item.single_payment_rate),
    installmentRate: Number(item.installment_rate),
    installmentCampaign: item.installment_campaign,
    imageUrl: item.image_url,
    stock: item.stock,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
  };
}

// Tüm telefonları getir
export async function getPhones(): Promise<Phone[]> {
  const { data, error } = await supabase
    .from("phones")
    .select("*, single_payment_price, installment_price")
    .eq("stock", true) // Sadece stokta olan telefonları getir
    .order("cash_price", { ascending: false }); // Nakit fiyata göre pahalıdan ucuza

  if (error) {
    console.error("Telefonları getirirken hata:", error);
    return [];
  }

  return (data || []).map(mapDbPhone);
}

// Admin için tüm telefonları getir (stok durumu fark etmez)
export async function getAllPhones(): Promise<Phone[]> {
  const { data, error } = await supabase
    .from("phones")
    .select("*, single_payment_price, installment_price")
    .order("cash_price", { ascending: false }); // Nakit fiyata göre pahalıdan ucuza

  if (error) {
    console.error("Telefonları getirirken hata:", error);
    return [];
  }

  return (data || []).map(mapDbPhone);
}

// Yeni telefon ekle
export async function addPhone(
  phone: Omit<Phone, "id" | "createdAt" | "updatedAt">
): Promise<Phone | null> {
  const { data, error } = await supabase
    .from("phones")
    .insert([
      {
        brand: phone.brand,
        model: phone.model,
        colors: phone.colors,
        cash_price: phone.cashPrice,
        single_payment_rate: phone.singlePaymentRate,
        installment_rate: phone.installmentRate,
        installment_campaign: phone.installmentCampaign,
        image_url: phone.imageUrl,
        stock: phone.stock,
      },
    ])
    .select("*, single_payment_price, installment_price")
    .single();

  if (error) {
    console.error("Telefon eklerken hata:", error);
    return null;
  }

  return data ? mapDbPhone(data) : null;
}

// Telefon güncelle
export async function updatePhone(
  id: string,
  phone: Partial<Phone>
): Promise<Phone | null> {
  const updateData: Record<string, unknown> = {};

  if (phone.brand !== undefined) updateData.brand = phone.brand;
  if (phone.model !== undefined) updateData.model = phone.model;
  if (phone.colors !== undefined) updateData.colors = phone.colors;
  if (phone.cashPrice !== undefined) updateData.cash_price = phone.cashPrice;
  if (phone.singlePaymentRate !== undefined)
    updateData.single_payment_rate = phone.singlePaymentRate;
  if (phone.installmentRate !== undefined)
    updateData.installment_rate = phone.installmentRate;
  if (phone.installmentCampaign !== undefined)
    updateData.installment_campaign = phone.installmentCampaign;
  if (phone.imageUrl !== undefined) updateData.image_url = phone.imageUrl;
  if (phone.stock !== undefined) updateData.stock = phone.stock;

  const { data, error } = await supabase
    .from("phones")
    .update(updateData)
    .eq("id", id)
    .select("*, single_payment_price, installment_price")
    .single();

  if (error) {
    console.error("Telefon güncellerken hata:", error);
    return null;
  }

  return data ? mapDbPhone(data) : null;
}

// Telefon sil
export async function deletePhone(id: string): Promise<boolean> {
  const { error } = await supabase.from("phones").delete().eq("id", id);

  if (error) {
    console.error("Telefon silerken hata:", error);
    return false;
  }

  return true;
}

// Real-time subscription - Artımlı güncelleme (Önerilen)
// Her event'te sadece değişen kaydı günceller, tüm listeyi yeniden çekmez
export function subscribeToPhones(
  onChange: (updater: (prev: Phone[]) => Phone[]) => void
) {
  const channel = supabase
    .channel("realtime:phones")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "phones" },
      (payload) => {
        if (payload.eventType === "INSERT" && payload.new) {
          const newPhone = mapDbPhone(payload.new as unknown as DbPhone);
          onChange((prev) => {
            // Sadece stokta olan telefonları ekle
            if (newPhone.stock) {
              const updated = [newPhone, ...prev];
              // Nakit fiyata göre pahalıdan ucuza sırala
              return updated.sort((a, b) => b.cashPrice - a.cashPrice);
            }
            return prev;
          });
        } else if (payload.eventType === "UPDATE" && payload.new) {
          const updatedPhone = mapDbPhone(payload.new as unknown as DbPhone);
          onChange((prev) => {
            if (updatedPhone.stock) {
              // Stokta ise güncelle ve sırala
              const updated = prev.map((p) =>
                p.id === updatedPhone.id ? updatedPhone : p
              );
              // Nakit fiyata göre pahalıdan ucuza sırala
              return updated.sort((a, b) => b.cashPrice - a.cashPrice);
            } else {
              // Stokta değilse listeden kaldır
              return prev.filter((p) => p.id !== updatedPhone.id);
            }
          });
        } else if (payload.eventType === "DELETE" && payload.old) {
          const oldId = (payload.old as { id: string }).id;
          onChange((prev) => prev.filter((p) => p.id !== oldId));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Admin için real-time subscription (tüm telefonları gösterir)
export function subscribeToAllPhones(
  onChange: (updater: (prev: Phone[]) => Phone[]) => void
) {
  const channel = supabase
    .channel("realtime:all-phones")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "phones" },
      (payload) => {
        if (payload.eventType === "INSERT" && payload.new) {
          const newPhone = mapDbPhone(payload.new as unknown as DbPhone);
          onChange((prev) => {
            const updated = [newPhone, ...prev];
            // Nakit fiyata göre pahalıdan ucuza sırala
            return updated.sort((a, b) => b.cashPrice - a.cashPrice);
          });
        } else if (payload.eventType === "UPDATE" && payload.new) {
          const updatedPhone = mapDbPhone(payload.new as unknown as DbPhone);
          onChange((prev) => {
            const updated = prev.map((p) =>
              p.id === updatedPhone.id ? updatedPhone : p
            );
            // Nakit fiyata göre pahalıdan ucuza sırala
            return updated.sort((a, b) => b.cashPrice - a.cashPrice);
          });
        } else if (payload.eventType === "DELETE" && payload.old) {
          const oldId = (payload.old as { id: string }).id;
          onChange((prev) => prev.filter((p) => p.id !== oldId));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// Real-time subscription - Debounced refetch versiyonu
// Peş peşe gelen event'lerde tek fetch yapar
let refetchTimer: NodeJS.Timeout | null = null;
export function subscribeToPhonesRefetch(callback: (phones: Phone[]) => void) {
  const channel = supabase
    .channel("phones-refetch-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "phones" },
      () => {
        if (refetchTimer) clearTimeout(refetchTimer);
        refetchTimer = setTimeout(async () => {
          const phones = await getPhones();
          callback(phones);
        }, 200); // 200ms debounce
      }
    )
    .subscribe();

  return () => {
    if (refetchTimer) clearTimeout(refetchTimer);
    supabase.removeChannel(channel);
  };
}

// Mock data - Başlangıç verisi olarak kullanılabilir
export const mockPhones = [
  {
    id: "1",
    brand: "Apple",
    model: "iPhone 15 Pro Max 256GB",
    colors: ["Siyah", "Beyaz", "Titanyum Mavi", "Titanyum Gri"],
    cashPrice: 115000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    brand: "Apple",
    model: "iPhone 15 Pro 128GB",
    colors: ["Siyah", "Beyaz", "Titanyum Mavi"],
    cashPrice: 58000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    brand: "Apple",
    model: "iPhone 14 128GB",
    colors: ["Siyah", "Beyaz", "Mavi", "Mor"],
    cashPrice: 45000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    brand: "Samsung",
    model: "Galaxy S24 Ultra 256GB",
    colors: ["Titanyum Gri", "Titanyum Mavi", "Siyah"],
    cashPrice: 55000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    brand: "Samsung",
    model: "Galaxy S24 128GB",
    colors: ["Mor", "Yeşil", "Beyaz"],
    cashPrice: 42000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    brand: "Samsung",
    model: "Galaxy A54 128GB",
    colors: ["Yeşil", "Siyah", "Beyaz"],
    cashPrice: 18000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    brand: "Xiaomi",
    model: "Redmi Note 13 Pro 256GB",
    colors: ["Siyah", "Mavi", "Yeşil"],
    cashPrice: 12000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    brand: "Xiaomi",
    model: "Xiaomi 14 Pro 256GB",
    colors: ["Beyaz", "Siyah", "Gri"],
    cashPrice: 35000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    brand: "Huawei",
    model: "P60 Pro 256GB",
    colors: ["Gold", "Siyah", "Gümüş"],
    cashPrice: 32000,
    installmentRate: 1.15,
    singlePaymentRate: 1.05,
    stock: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ===== TAKSİT KAMPANYALARI FONKSİYONLARI =====

// Taksit kampanyalarını getir
export async function getInstallmentCampaigns(): Promise<
  InstallmentCampaign[]
> {
  try {
    const { data, error } = await supabase
      .from("installment_campaigns")
      .select("*")
      .order("bank_name", { ascending: true });

    if (error) {
      console.error("Taksit kampanyaları yüklenirken hata:", error);
      // Tablo yoksa boş array döndür
      if (
        error.code === "PGRST116" ||
        error.message.includes(
          'relation "installment_campaigns" does not exist'
        )
      ) {
        console.warn(
          "installment_campaigns tablosu henüz oluşturulmamış. Boş array döndürülüyor."
        );
        return [];
      }
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Taksit kampanyaları yüklenirken beklenmeyen hata:", error);
    return [];
  }
}

// Taksit kampanyası ekle
export async function addInstallmentCampaign(
  campaign: Omit<InstallmentCampaign, "id" | "created_at" | "updated_at">
): Promise<boolean> {
  try {
    const { error } = await supabase.from("installment_campaigns").insert({
      bank_name: campaign.bank_name,
      installment_description: campaign.installment_description,
    });

    if (error) {
      console.error("Taksit kampanyası eklenirken hata:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Taksit kampanyası eklenirken beklenmeyen hata:", error);
    return false;
  }
}

// Taksit kampanyası güncelle
export async function updateInstallmentCampaign(
  id: string,
  campaign: Partial<
    Omit<InstallmentCampaign, "id" | "created_at" | "updated_at">
  >
): Promise<boolean> {
  const { error } = await supabase
    .from("installment_campaigns")
    .update({
      bank_name: campaign.bank_name,
      installment_description: campaign.installment_description,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Taksit kampanyası güncellenirken hata:", error);
    return false;
  }

  return true;
}

// Taksit kampanyası sil
export async function deleteInstallmentCampaign(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("installment_campaigns")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Taksit kampanyası silinirken hata:", error);
    return false;
  }

  return true;
}

// Taksit kampanyaları için real-time subscription
export function subscribeToInstallmentCampaigns(
  callback: (
    updater: (prev: InstallmentCampaign[]) => InstallmentCampaign[]
  ) => void
): () => void {
  try {
    const subscription = supabase
      .channel("installment_campaigns_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "installment_campaigns",
        },
        async () => {
          try {
            // Değişiklik olduğunda tüm veriyi yeniden yükle
            const data = await getInstallmentCampaigns();
            callback(() => data);
          } catch (error) {
            console.error("Real-time subscription'da hata:", error);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error("Real-time subscription oluşturulurken hata:", error);
    // Boş unsubscribe fonksiyonu döndür
    return () => {};
  }
}
