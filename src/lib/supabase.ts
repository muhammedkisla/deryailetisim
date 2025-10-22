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
import { Phone } from "@/types";

// Tüm telefonları getir
export async function getPhones(): Promise<Phone[]> {
  const { data, error } = await supabase
    .from("phones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Telefonları getirirken hata:", error);
    return [];
  }

  return data || [];
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
        image_url: phone.imageUrl,
        stock: phone.stock,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Telefon eklerken hata:", error);
    return null;
  }

  return data
    ? {
        id: data.id,
        brand: data.brand,
        model: data.model,
        colors: data.colors,
        cashPrice: data.cash_price,
        singlePaymentRate: data.single_payment_rate,
        installmentRate: data.installment_rate,
        imageUrl: data.image_url,
        stock: data.stock,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : null;
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
  if (phone.imageUrl !== undefined) updateData.image_url = phone.imageUrl;
  if (phone.stock !== undefined) updateData.stock = phone.stock;

  const { data, error } = await supabase
    .from("phones")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Telefon güncellerken hata:", error);
    return null;
  }

  return data
    ? {
        id: data.id,
        brand: data.brand,
        model: data.model,
        colors: data.colors,
        cashPrice: data.cash_price,
        singlePaymentRate: data.single_payment_rate,
        installmentRate: data.installment_rate,
        imageUrl: data.image_url,
        stock: data.stock,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    : null;
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

// Real-time subscription için
export function subscribeToPhones(callback: (phones: Phone[]) => void) {
  const subscription = supabase
    .channel("phones-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "phones" },
      async () => {
        // Değişiklik olduğunda tüm telefonları yeniden çek
        const phones = await getPhones();
        callback(phones);
      }
    )
    .subscribe();

  return subscription;
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
