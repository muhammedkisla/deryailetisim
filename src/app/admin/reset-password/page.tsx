"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Toast, { ToastType } from "@/components/Toast";

function ResetPasswordContent() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    // Yeni akış: Session zaten auth/callback sayfasında kurulmuş olmalı
    // Sadece session'ın var olup olmadığını kontrol et
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        console.log("Reset password - Session kontrolü:", {
          hasSession: !!session,
          user: session?.user?.email || "Yok",
          error: error?.message || "Yok",
        });

        if (error || !session) {
          console.error("Session bulunamadı:", error);
          showToast(
            "Geçersiz şifre sıfırlama bağlantısı. Lütfen tekrar deneyin.",
            "error"
          );
          setTimeout(() => {
            router.push("/admin/login");
          }, 3000);
          return;
        }

        console.log("Session mevcut, şifre sıfırlama formu hazır");
      } catch (error) {
        console.error("Session kontrol hatası:", error);
        showToast("Session kontrolü sırasında hata oluştu", "error");
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      }
    };

    checkSession();
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Şifreler eşleşmiyor", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Şifre en az 6 karakter olmalıdır", "error");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        showToast("Şifre güncellenirken bir hata oluştu", "error");
        return;
      }

      showToast(
        "Şifre başarıyla güncellendi! Güvenlik için çıkış yapılıyor...",
        "success"
      );

      // Güvenlik için kullanıcıyı çıkış yaptır
      await supabase.auth.signOut();

      setTimeout(() => {
        router.push("/admin/login?reset=success");
      }, 2000);
    } catch {
      showToast("Şifre güncellenirken bir hata oluştu", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-500 to-red-700 px-4">
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
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Şifre Sıfırla</h1>
            <p className="text-gray-600 mt-2">Yeni şifrenizi belirleyin</p>
          </div>

          {/* Şifre Sıfırlama Formu */}
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Yeni Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="En az 6 karakter"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </form>

          {/* Giriş Sayfasına Dön */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors"
            >
              ← Giriş sayfasına dön
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-500 to-red-700 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
