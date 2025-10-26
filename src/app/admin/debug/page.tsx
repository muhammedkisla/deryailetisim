"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Toast, { ToastType } from "@/components/Toast";

export default function DebugPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
  } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      // Supabase bağlantısını test et
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Supabase konfigürasyonunu kontrol et
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      // Environment'a göre doğru URL'yi belirle
      const baseUrl =
        process.env.NODE_ENV === "production"
          ? "https://deryailetisim.vercel.app"
          : window.location.origin;
      // Yeni akış: auth/callback sayfasına yönlendir
      const redirectUrl = `${baseUrl}/auth/callback?next=/admin/reset-password`;

      // URL parametrelerini kontrol et
      const urlParams = new URLSearchParams(window.location.search);
      const urlParamsObj = Object.fromEntries(urlParams.entries());

      const debugData = {
        environment: process.env.NODE_ENV,
        supabaseUrl: supabaseUrl ? "✅ Tanımlı" : "❌ Eksik",
        supabaseKey: supabaseKey ? "✅ Tanımlı" : "❌ Eksik",
        currentUrl: window.location.origin,
        currentPath: window.location.pathname,
        urlParams: urlParamsObj,
        productionUrl: "https://deryailetisim.vercel.app",
        calculatedBaseUrl: baseUrl,
        calculatedRedirectUrl: redirectUrl,
        session: session ? "✅ Aktif" : "❌ Yok",
        sessionError: sessionError?.message || "Yok",
        timestamp: new Date().toISOString(),
      };

      setDebugInfo(debugData);
      showToast("Supabase bağlantısı test edildi", "success");
    } catch (error) {
      console.error("Debug test error:", error);
      showToast("Debug test sırasında hata oluştu", "error");
    } finally {
      setLoading(false);
    }
  };

  const testEmailReset = async () => {
    if (!email.trim()) {
      showToast("Lütfen e-posta adresi girin", "error");
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

      console.log("Test email reset için:", email);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      const result = {
        success: !error,
        data,
        error: error
          ? {
              message: error.message,
              status: error.status,
              name: error.name,
            }
          : null,
        timestamp: new Date().toISOString(),
      };

      setDebugInfo((prev) => ({
        ...prev,
        emailTest: result,
      }));

      if (error) {
        let errorMessage = `Email test hatası: ${error.message}`;
        if (error.status === 429 || error.message.includes("rate limit")) {
          errorMessage =
            "Rate limit aşıldı. 15-30 dakika bekleyip tekrar deneyin.";
        }
        showToast(errorMessage, "error");
      } else {
        showToast("Email test başarılı", "success");
      }
    } catch (err) {
      console.error("Email test catch error:", err);
      showToast("Email test sırasında beklenmeyen hata", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Supabase Debug Sayfası
          </h1>

          {/* Supabase Bağlantı Testi */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Supabase Bağlantı Testi
            </h2>
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Test Ediliyor..." : "Bağlantıyı Test Et"}
            </button>
          </div>

          {/* Email Reset Testi */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Email Reset Testi
            </h2>
            <div className="flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Test e-posta adresi"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={testEmailReset}
                disabled={loading || !email.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Test Ediliyor..." : "Email Test Et"}
              </button>
            </div>
          </div>

          {/* Debug Bilgileri */}
          {debugInfo && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Debug Bilgileri
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Supabase Konfigürasyon Kontrol Listesi */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Supabase Email Konfigürasyon Kontrol Listesi
            </h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Supabase Dashboard'da kontrol edilmesi gerekenler:
              </h3>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li>Authentication → Settings → Email Templates</li>
                <li>Authentication → Settings → SMTP Settings (opsiyonel)</li>
                <li>Authentication → Settings → URL Configuration</li>
                <li>Site URL: https://deryailetisim.vercel.app</li>
                <li>
                  Redirect URLs: https://deryailetisim.vercel.app/auth/callback
                </li>
                <li>
                  Additional Redirect URLs: http://localhost:3000/auth/callback
                  (development için)
                </li>
                <li>Email confirmation: Aktif olmalı</li>
                <li>Password reset: Aktif olmalı</li>
                <li>Rate limits: Supabase varsayılan limitleri kontrol edin</li>
              </ul>

              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  "Error sending recovery email" Çözümleri:
                </h4>
                <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                  <li>
                    <strong>SMTP Ayarları:</strong> Custom SMTP kullanıyorsanız,
                    ayarlarınızı kontrol edin
                  </li>
                  <li>
                    <strong>Email Templates:</strong> Reset Password
                    template'inin aktif olduğundan emin olun
                  </li>
                  <li>
                    <strong>Rate Limit:</strong> Çok fazla istek gönderilirse
                    15-30 dakika bekleyin
                  </li>
                  <li>
                    <strong>Email Doğrulama:</strong> Kullanıcının email
                    adresinin doğrulanmış olduğundan emin olun
                  </li>
                  <li>
                    <strong>Supabase Status:</strong>{" "}
                    <a
                      href="https://status.supabase.com"
                      target="_blank"
                      className="underline"
                    >
                      status.supabase.com
                    </a>{" "}
                    adresinden servis durumunu kontrol edin
                  </li>
                  <li>
                    <strong>Farklı Email:</strong> Farklı bir email adresi ile
                    test edin (Gmail, Outlook, vs.)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Geri Dön Butonu */}
          <div className="text-center">
            <a
              href="/admin/login"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              ← Login Sayfasına Dön
            </a>
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
