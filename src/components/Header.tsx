import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <Link
            href="/"
            className="w-48 h-48 bg-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(255,255,255,0.4)] flex items-center justify-center"
          >
            <Image
              src="/logo.png"
              alt="Derya İletişim"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
