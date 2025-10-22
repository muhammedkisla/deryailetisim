// Telefon renkleri için yardımcı fonksiyonlar

// Yaygın telefon renkleri
export const phoneColors = [
  { name: "Siyah", bg: "#000000", text: "#FFFFFF" },
  { name: "Beyaz", bg: "#FFFFFF", text: "#000000", border: true },
  { name: "Gri", bg: "#6B7280", text: "#FFFFFF" },
  { name: "Gümüş", bg: "#C0C0C0", text: "#000000" },
  { name: "Gold", bg: "#FFD700", text: "#000000" },
  { name: "Rose Gold", bg: "#B76E79", text: "#FFFFFF" },
  { name: "Mavi", bg: "#3B82F6", text: "#FFFFFF" },
  { name: "Mor", bg: "#9333EA", text: "#FFFFFF" },
  { name: "Yeşil", bg: "#10B981", text: "#FFFFFF" },
  { name: "Kırmızı", bg: "#EF4444", text: "#FFFFFF" },
  { name: "Açık Pembe", bg: "#FFC0CB", text: "#000000" },
  { name: "Titanyum Gri", bg: "#52525B", text: "#FFFFFF" },
  { name: "Titanyum Mavi", bg: "#60A5FA", text: "#FFFFFF" },
  {
    name: "Çeşitli",
    bg: "linear-gradient(90deg, #ff0000 0%, #ff7f00 16.67%, #ffff00 33.33%, #00ff00 50%, #0000ff 66.67%, #8b00ff 83.33%, #ff00ff 100%)",
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
