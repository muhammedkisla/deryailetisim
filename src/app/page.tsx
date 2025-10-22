import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RotatingText from "@/components/RotatingText";
import Image from "next/image";
import Link from "next/link";

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
              src="/hero.jpg"
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
            <div className="mb-8 mt-16 min-h-[200px] flex items-center justify-center">
              <RotatingText />
            </div>
            <div className="flex justify-center space-x-4">
              <Link
                href="#iletisim"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </section>

        {/* Öne Çıkan Özellikler */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Konya'nın En Uygun Telefon Noktası */}
                <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-blue-200">
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="bg-linear-to-br from-green-50 to-green-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-green-200">
                  <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    Kredi kartına 3-6-9-12 ay taksit imkanı
                  </p>
                </div>

                {/* Kargo */}
                <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-purple-200">
                  <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
                <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center hover:shadow-xl transition-shadow duration-300 border border-orange-200">
                  <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
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
                    0, 2. El alım satım ve telefon tamiri
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
                  telefonu ve aksesuarları sunmak için çalışıyoruz. Sektördeki
                  yıllara dayanan deneyimimiz ve güvenilir hizmet anlayışımız
                  ile müşteri memnuniyetini her zaman ön planda tutuyoruz.
                </p>
                <p className="text-lg text-center text-gray-700 leading-relaxed mb-6">
                  Geniş ürün yelpazemiz ve uygun fiyat politikamız ile her
                  bütçeye uygun çözümler sunuyoruz. Nakit, tek çekim ve taksit
                  seçenekleri ile alışverişinizi kolaylaştırıyoruz.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      10+
                    </div>
                    <div className="text-gray-700">Yıllık Deneyim</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      1000+
                    </div>
                    <div className="text-gray-700">Mutlu Müşteri</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      100%
                    </div>
                    <div className="text-gray-700">Güvenilir Hizmet</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hizmetlerimiz */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Hizmetlerimiz
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
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
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Cep Telefonu Satışı
                </h3>
                <p className="text-gray-600">
                  En son model telefonlardan uygun fiyatlı cihazlara kadar geniş
                  ürün yelpazesi
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Uygun Ödeme Seçenekleri
                </h3>
                <p className="text-gray-600">
                  Nakit, tek çekim ve taksit seçenekleri ile esnek ödeme imkanı
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Güvenilir Hizmet
                </h3>
                <p className="text-gray-600">
                  Orijinal ürünler ve garanti belgesi ile güvenli alışveriş
                </p>
              </div>
            </div>
          </div>
        </section>

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
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                        <p className="text-gray-600">+90 (537) 347 08 88</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                        <p className="text-gray-600">info@deryailetisim.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-600"
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
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg
                          className="w-6 h-6 text-blue-600"
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

                    <div className="bg-blue-50 p-6 rounded-lg">
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
    </div>
  );
}
