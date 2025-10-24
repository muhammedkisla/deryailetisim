import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Derya İletişim - Konya Cep Telefonu ve Aksesuar Mağazası",
  description:
    "Konya'da cep telefonu, aksesuar satışı ve tamiri. Apple, Samsung, Xiaomi markalarında en uygun fiyatlar. Taksit imkanı, kargo hizmeti. Şehit Kemal Türkeş Mahallesi, Karatay/Konya.",
  metadataBase: new URL("https://deryailetisim.vercel.app"),

  // PUBLIC klasörü kullandığın için burayı elle belirtiyoruz:
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      {
        url: "/web-app-manifest-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
      {
        url: "/web-app-manifest-512x512.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    apple: [
      // RealFaviconGenerator genelde bunu da üretir; yoksa ekleyebilirsin
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },

  openGraph: {
    title: "Derya İletişim - Konya Cep Telefonu Mağazası",
    description:
      "Konya'da cep telefonu, aksesuar satışı ve tamiri. En uygun fiyatlar, taksit imkanı.",
    url: "https://deryailetisim.vercel.app",
    siteName: "Derya İletişim",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/logo-bg.jpeg",
        width: 1200,
        height: 630,
        alt: "Derya İletişim - Konya Cep Telefonu Mağazası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Derya İletişim - Konya Cep Telefonu Mağazası",
    description:
      "Konya'da cep telefonu, aksesuar satışı ve tamiri. En uygun fiyatlar, taksit imkanı.",
    images: ["/logo-bg.jpeg"],
  },
  verification: { google: "google-site-verification-code-here" },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
