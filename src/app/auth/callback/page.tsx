"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Toast, { ToastType } from "@/components/Toast";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const code = searchParams.get("code");
    const token = searchParams.get("token");
    const type = searchParams.get("type");
    const next = searchParams.get("next") || "/admin/reset-password";

    console.log("Auth callback - URL params:", {
      code: code ? "✅ Var" : "❌ Yok",
      token: token ? "✅ Var" : "❌ Yok",
      type: type || "❌ Yok",
      next: next,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    async function run() {
      // Eğer code varsa yeni akış, token varsa eski akış
      if (code) {
        try {
          console.log("Code ile session exchange ediliyor...");
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error("Session exchange error:", error);
            setErr(error.message);
            showToast(`Session hatası: ${error.message}`, "error");
            setTimeout(() => {
              router.replace("/admin/login");
            }, 3000);
            return;
          }

          console.log("Session başarıyla exchange edildi:", data);
          showToast("Oturum açıldı, yönlendiriliyorsunuz...", "success");

          // Başarılı olduğunda next sayfasına yönlendir
          setTimeout(() => {
            router.replace(next);
          }, 1000);
        } catch (error) {
          console.error("Unexpected error in auth callback:", error);
          setErr("Beklenmeyen bir hata oluştu");
          showToast("Beklenmeyen bir hata oluştu", "error");
          setTimeout(() => {
            router.replace("/admin/login");
          }, 3000);
        }
      } else if (type === "recovery") {
        // Eski akış: hash'ten token'ları al
        try {
          console.log("Hash'ten token'lar alınıyor...");
          // URL hash'inden access_token ve refresh_token'ı çıkar
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");
          
          console.log("Hash params:", {
            accessToken: accessToken ? "✅ Var" : "❌ Yok",
            refreshToken: refreshToken ? "✅ Var" : "❌ Yok",
            hash: window.location.hash
          });
          
          if (!accessToken || !refreshToken) {
            throw new Error("Hash'te token'lar bulunamadı");
          }

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Session set error:", error);
            setErr(error.message);
            showToast(`Session hatası: ${error.message}`, "error");
            setTimeout(() => {
              router.replace("/admin/login");
            }, 3000);
            return;
          }

          console.log("Session başarıyla kuruldu:", data);
          showToast("Oturum açıldı, yönlendiriliyorsunuz...", "success");

          setTimeout(() => {
            router.replace(next);
          }, 1000);
        } catch (error) {
          console.error("Token session error:", error);
          setErr("Token ile session kurulamadı");
          showToast("Token ile session kurulamadı", "error");
          setTimeout(() => {
            router.replace("/admin/login");
          }, 3000);
        }
      } else {
        const errorMsg = "Geçersiz bağlantı (code veya token eksik).";
        console.error("Auth callback error:", errorMsg);
        setErr(errorMsg);
        showToast(errorMsg, "error");
        setTimeout(() => {
          router.replace("/admin/login");
        }, 3000);
      }
    }

    run();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-500 to-red-700 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Yönlendiriliyorsunuz...
            </h1>
            {err ? (
              <div className="text-red-600">
                <p className="font-semibold">Hata:</p>
                <p className="text-sm">{err}</p>
                <p className="text-xs mt-2">
                  Giriş sayfasına yönlendiriliyorsunuz...
                </p>
              </div>
            ) : (
              <div className="text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                <p>Oturum açılıyor...</p>
              </div>
            )}
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

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-red-500 to-red-700 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
                <p>Yükleniyor...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
