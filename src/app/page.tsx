import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingText from "@/components/RotatingText";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP_PHONE = (
  process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "905373470888"
).replace(/[^0-9]/g, "");
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-white">
      <Header />

      <main className="grow">
        {/* Hero Section with Background Image */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero.webp"
              alt="Derya İletişim - Cep Telefonları"
              fill
              className="object-cover"
              priority
              quality={90}
              sizes="100vw"
            />
            {/* Hafif Dark Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/25 to-black/35" />
          </div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="mb-6 mt-24 flex items-center justify-center"></div>
            <div className="mb-3 h-[120px] md:h-[160px] lg:h-[180px] flex items-center justify-center overflow-hidden">
              <RotatingText />
            </div>

            <div className="flex justify-center mt-4">
              <Link
                href="#iletisim"
                className="bg-white/10 text-white border border-red-600/30 px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 shadow-md"
              >
                İletişime Geç
              </Link>
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-8 text-white/80 animate-bounce hidden md:block">
            <div className="flex flex-col items-center text-sm">
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Öne Çıkan Özellikler */}
        <section id="ozellikler" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Öne Çıkan Özellikler
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Konya'nın En Uygun Telefon Noktası */}
                <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-red-200">
                  <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Konya&apos;nın Telefon Merkezi
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Toptan ve perakende en uygun telefon noktası
                  </p>
                </div>

                {/* Taksit İmkanı */}
                <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-red-200">
                  <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Esnek Ödeme
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Kredi kartlarına 3-6-9-12 ay taksit imkanı
                  </p>
                </div>

                {/* Kargo */}
                <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-red-200">
                  <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Kargo
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Tüm Türkiye&apos;ye kargo imkanı
                  </p>
                </div>

                {/* 2. El ve Tamir */}
                <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-red-200">
                  <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Alım Satım & Tamir
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    0, 2. el alım satım ve telefon tamiri
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hakkımızda */}
        <section id="hakkimizda" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Hakkımızda
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <p className="text-lg text-center text-gray-700 leading-relaxed mb-6">
                  Derya İletişim olarak, müşterilerimize en kaliteli cep
                  telefonu ve aksesuarları sunmak için çalışıyoruz.
                </p>
                <p className="text-lg text-center text-gray-700 leading-relaxed mb-6">
                  <span className="font-bold">***</span>
                </p>
                <p className="text-lg text-center text-gray-700 leading-relaxed mb-6">
                  Sektördeki yıllara dayanan deneyimimiz ve güvenilir hizmet
                  anlayışımız ile müşteri memnuniyetini her zaman ön planda
                  tutuyoruz.
                </p>
                <p className="text-lg text-center text-gray-700 leading-relaxed mb-6">
                  <span className="font-bold">***</span>
                </p>
                <p className="text-lg text-center text-gray-700 leading-relaxed mb-6">
                  Geniş ürün yelpazemiz ve uygun fiyat politikamız ile her
                  bütçeye uygun çözümler sunuyoruz. Nakit, tek çekim ve taksit
                  seçenekleri ile alışverişinizi kolaylaştırıyoruz.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      10+
                    </div>
                    <div className="text-gray-700">Yıllık Deneyim</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      1000+
                    </div>
                    <div className="text-gray-700">Mutlu Müşteri</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      100%
                    </div>
                    <div className="text-gray-700">Güvenilir Hizmet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hizmetlerimiz bölümü kullanıcı isteğiyle kaldırıldı */}

        {/* İletişim */}
        <section id="iletisim" className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              İletişim Bilgileri
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Telefon
                        </h3>
                        <p className="text-gray-600">
                          <a
                            href="tel:+905373470888"
                            className="hover:text-red-600 transition-colors"
                          >
                            +90 (537) 347 08 88
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          E-posta
                        </h3>
                        <p className="text-gray-600">
                          <a
                            href="mailto:info@deryailetisim.com"
                            className="hover:text-red-600 transition-colors"
                          >
                            info@deryailetisim.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Adres
                        </h3>
                        <p className="text-gray-600">
                          Şehit Kemal Türkeş Mahallesi, İstanbul Cd. Konaltaş İş
                          Hanı altı no:103/A, 42030 Karatay/Konya
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">
                          Çalışma Saatleri
                        </h3>
                        <p className="text-gray-600">
                          Pazartesi - Cumartesi: 08:00 - 20:00
                        </p>
                        <p className="text-gray-600">Pazar: 12:00 - 17:30</p>
                      </div>
                    </div>

                    <div className="bg-red-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Bizi Ziyaret Edin
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Mağazamıza gelerek ürünlerimizi yakından inceleyebilir
                        ve uzman ekibimizden detaylı bilgi alabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Maps */}
                <div className="mt-8">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d787.371414346391!2d32.500067269660455!3d37.87232359824756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d085e27467f82b%3A0x8dbcd6112d20cb60!2zREVSWUEgxLBMRVTEsMWexLBN!5e0!3m2!1str!2str!4v1761138092753!5m2!1str!2str"
                        className="absolute top-0 left-0 w-full h-full border-0"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Derya İletişim Konum"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geç"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg hover:shadow-xl hover:bg-green-500 transition flex items-center justify-center"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-6 h-6 fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z"
            fill="#BFC8D0"
          />
          <path
            d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z"
            fill="url(#paint0_linear_87_7264)"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z"
            fill="white"
          />
          <path
            d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z"
            fill="white"
          />
          <defs>
            <linearGradient
              id="paint0_linear_87_7264"
              x1="26.5"
              y1="7"
              x2="4"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5BD066" />
              <stop offset="1" stopColor="#27B43E" />
            </linearGradient>
          </defs>
        </svg>
      </a>
    </div>
  );
}
