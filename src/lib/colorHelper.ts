// Telefon renkleri için yardımcı fonksiyonlar

// Yaygın telefon renkleri
export interface PhoneColor {
  name: string;
  bg: string;
  text: string;
  border?: boolean;
}

export const phoneColors: PhoneColor[] = [
  { name: "Siyah", bg: "#000000", text: "#FFFFFF" },
  { name: "Beyaz", bg: "#FFFFFF", text: "#000000", border: true },
  { name: "Gri", bg: "#6B7280", text: "#FFFFFF" },
  { name: "Gümüş", bg: "#C0C0C0", text: "#000000", border: true },
  { name: "Gold", bg: "#FFD700", text: "#000000" },
  { name: "Rose Gold", bg: "#B76E79", text: "#FFFFFF" },
  { name: "Mavi", bg: "#3B82F6", text: "#FFFFFF" },
  { name: "Mor", bg: "#9333EA", text: "#FFFFFF" },
  { name: "Yeşil", bg: "#10B981", text: "#FFFFFF" },
  { name: "Kırmızı", bg: "#EF4444", text: "#FFFFFF" },
  { name: "Açık Pembe", bg: "#FFC0CB", text: "#000000", border: true },
  { name: "Titanyum Gri", bg: "#52525B", text: "#FFFFFF" },
  { name: "Titanyum Mavi", bg: "#60A5FA", text: "#FFFFFF" },

  // 🔹 Yeni eklenen popüler renkler
  { name: "Gece Mavisi", bg: "#1E3A8A", text: "#FFFFFF" },
  { name: "Orman Yeşili", bg: "#065F46", text: "#FFFFFF" },
  { name: "Grafit", bg: "#2F2F2F", text: "#FFFFFF" },
  { name: "Bej", bg: "#F5F5DC", text: "#000000", border: true },
  { name: "Lavanta", bg: "#C084FC", text: "#000000" },

  // 🔹 Özel çok renkli (gradient) model
  {
    name: "Çeşitli",
    bg: "linear-gradient(135deg, #3B82F6 0%, #9333EA 50%, #EF4444 100%)",
    text: "#FFFFFF",
  },
];

// Renk adından hex kodu getir
export function getColorHex(colorName: string): string {
  const color = phoneColors.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return color?.bg || "#6B7280"; // Varsayılan gri
}

// Renk için text rengi
export function getColorTextColor(colorName: string): string {
  const color = phoneColors.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return color?.text || "#FFFFFF";
}

// Border gerekli mi?
export function colorNeedsBorder(colorName: string): boolean {
  const color = phoneColors.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return color?.border || false;
}
