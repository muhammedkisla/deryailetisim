import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/logo-bg.jpeg"
                alt="Derya İletişim - Konya Telefon Tamiri ve Satışı Logo"
                width={60}
                height={60}
                className="rounded-lg"
                style={{ width: "auto", height: "auto" }}
              />
              <h3 className="text-xl font-bold">Derya İletişim</h3>
            </div>
            <p className="text-white">
              Güvenilir ve kaliteli telefonculuk hizmetleri
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">İletişim</h4>
            <ul className="space-y-2 text-white">
              <li className="flex items-center space-x-2">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>+90 (507) 263 82 82</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Çalışma Saatleri</h4>
            <p className="text-white">Pazartesi - Cumartesi: 08:00 - 20:00</p>
            <p className="text-white">Pazar: 12:00 - 17:30</p>
          </div>
        </div>

        <div className="border-t border-white mt-8 pt-8 text-right text-white">
          <p className="text-xs">
            &copy; {currentYear} Derya İletişim. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
