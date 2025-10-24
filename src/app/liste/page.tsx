import { Metadata } from "next";
import PriceListClient from "./PriceListClient";

export const metadata: Metadata = {
  title: "Günlük Telefon Fiyat Listesi - Derya İletişim Konya",
  description:
    "Güncel cep telefonu fiyatları. Apple, Samsung, Xiaomi markalarında nakit, tek çekim ve taksit fiyatları. Günlük güncellenen fiyat listesi.",
  keywords:
    "Konya telefon fiyatları, güncel telefon fiyat listesi, Apple fiyat, Samsung fiyat, Xiaomi fiyat, taksitli telefon, nakit telefon fiyatı",
  openGraph: {
    title: "Günlük Telefon Fiyat Listesi - Derya İletişim",
    description:
      "Güncel cep telefonu fiyatları. Nakit, tek çekim ve taksit seçenekleri.",
    url: "https://deryailetisim.vercel.app/liste",
    images: ["/logo-bg.jpeg"],
  },
};

export default function PriceListPage() {
  return <PriceListClient />;
}
