"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Toast, { ToastType } from "@/components/Toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetCooldown, setResetCooldown] = useState(0);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  // Cooldown timer
  useEffect(() => {
    if (resetCooldown > 0) {
      const timer = setTimeout(() => {
        setResetCooldown(resetCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resetCooldown]);

  // Şifre sıfırlama fonksiyonu
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      showToast("Lütfen önce e-posta adresinizi girin", "error");
      return;
    }

    setLoading(true);

    try {
      // Environment'a göre doğru URL'yi belirle
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://deryailetisim.vercel.app"
          : window.location.origin;

      // Yeni akış: auth/callback sayfasına yönlendir
      const redirectUrl = `${baseUrl}/auth/callback?next=/admin/reset-password`;

      console.log("Şifre sıfırlama isteği gönderiliyor:", email);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Base URL:", baseUrl);
      console.log("Redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      console.log("Supabase response:", { data, error });

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          status: error.status,
          name: error.name,
        });

        // Daha detaylı hata mesajları
        let errorMessage =
          "Şifre sıfırlama e-postası gönderilirken bir hata oluştu";

        if (error.message.includes("Invalid email")) {
          errorMessage = "Geçersiz e-posta adresi";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı";
        } else if (
          error.message.includes("rate limit") ||
          error.status === 429
        ) {
          errorMessage =
            "Çok fazla şifre sıfırlama isteği gönderildi. Lütfen 15-30 dakika bekleyip tekrar deneyin.";
          // Rate limit durumunda 30 dakika cooldown başlat
          setResetCooldown(30 * 60); // 30 dakika = 1800 saniye
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "E-posta adresi henüz doğrulanmamış";
        } else if (error.message.includes("Error sending recovery email")) {
          errorMessage =
            "E-posta gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
        } else {
          errorMessage = `Hata: ${error.message}`;
        }

        showToast(errorMessage, "error");
        return;
      }

      console.log("Şifre sıfırlama e-postası başarıyla gönderildi");
      showToast(
        "Şifre sıfırlama e-postası gönderildi! E-posta kutunuzu kontrol edin.",
        "success"
      );
    } catch (err) {
      console.error("Catch error details:", err);
      showToast(
        "Şifre sıfırlama e-postası gönderilirken beklenmeyen bir hata oluştu",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        showToast("E-posta veya şifre hatalı", "error");
        return;
      }

      if (data.user) {
        // Session storage'a kaydet (eski sistemle uyumluluk için)
        sessionStorage.setItem("isAdminLoggedIn", "true");
        showToast("Başarıyla giriş yapıldı!", "success");

        // Kısa bir gecikme sonrası dashboard'a yönlendir
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      }
    } catch {
      showToast("Giriş yapılırken bir hata oluştu", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-300 to-red-900 px-4">
      {/* Liste Sayfasına Git Butonu */}
      <Link
        href="/liste"
        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-red-600 hover:text-red-800 px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 flex items-center gap-2"
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        Liste Sayfasına Git
      </Link>

      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo ve Başlık */}
          <div className="text-center mb-8">
            <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Yönetici Girişi
            </h1>
            <p className="text-gray-600 mt-2">Derya İletişim Admin Paneli</p>
          </div>

          {/* Giriş Formu */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="admin@deryailetisim.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
          </form>

          {/* Şifremi Unuttum Linki */}
          <div className="mt-4 flex justify-center items-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading || resetCooldown > 0}
              className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetCooldown > 0
                ? `Tekrar deneyin (${Math.floor(resetCooldown / 60)}:${(
                    resetCooldown % 60
                  )
                    .toString()
                    .padStart(2, "0")})`
                : "Şifremi Unuttum"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
