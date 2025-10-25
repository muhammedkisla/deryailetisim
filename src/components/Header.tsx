"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isHidden, setIsHidden] = useState(false);
  const lastYRef = useRef(0);
  const whatsappPhone = (
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "905373470888"
  ).replace(/[^0-9]/g, "");
  const telHref = `tel:+${whatsappPhone}`;

  useEffect(() => {
    const TOP_THRESHOLD = 80;
    const DOWN_DELTA = 10; // minimum downward movement to hide
    const UP_DELTA = 40; // minimum upward movement to show

    const onScroll = () => {
      const currentY = window.scrollY;
      const lastY = lastYRef.current;
      const delta = currentY - lastY;

      if (currentY < TOP_THRESHOLD) {
        setIsHidden(false);
      } else {
        if (delta > DOWN_DELTA) {
          setIsHidden(true);
        } else if (delta < -UP_DELTA) {
          // Only show again when user scrolls up near the top/hero midpoint
          const showAtY = Math.max(20, window.innerHeight * 0.5);
          if (currentY <= showAtY) {
            setIsHidden(false);
          }
        }
      }

      lastYRef.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur supports-backdrop-filter:bg-white/60 shadow-md">
          <div className="px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Derya İletişim - Konya Cep Telefonu Mağazası Logo"
                width={160}
                height={160}
                sizes="(min-width: 1024px) 80px, (min-width: 768px) 64px, (min-width: 640px) 56px, 56px"
                className="rounded-lg object-contain w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20"
                priority
              />
              <span className="hidden sm:block font-semibold text-gray-900">
                Derya İletişim
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-gray-700">
              <a
                href="#hakkimizda"
                className="hover:text-red-900 transition-colors"
              >
                Hakkımızda
              </a>
              <a
                href="#ozellikler"
                className="hover:text-red-900 transition-colors"
              >
                Öne Çıkanlar
              </a>
              <a
                href="#iletisim"
                className="hover:text-red-900 transition-colors"
              >
                İletişim
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={telHref}
                className="inline-flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-xl font-medium shadow hover:shadow-lg hover:brightness-110 transition-all"
              >
                <svg
                  className="w-4 h-4"
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
                Bizi Ara
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
