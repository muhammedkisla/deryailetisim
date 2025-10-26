import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    // Güvenlik: Sadece bizim cron'un çağırdığından emin olmak için gizli token
    const url = new URL(request.url);
    const token = url.searchParams.get("token");

    if (token !== process.env.HEARTBEAT_SECRET) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Sadece server'da kullanılır

    // Service role key ile client oluştur (bypass RLS)
    const supabase = createClient(supabaseUrl, serviceKey);

    // Çok hafif bir sorgu: satır çekmeden sadece "HEAD" isteği + count (0 bile olabilir)
    const { error, count } = await supabase
      .from("phones")
      .select("id", { head: true, count: "exact" })
      .limit(1);

    if (error) {
      console.error("Heartbeat query error:", error);
      throw error;
    }

    console.log(
      `✅ Heartbeat başarılı - Tablo aktif, kayıt sayısı: ${count ?? "N/A"}`
    );

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      count: count ?? 0,
    });
  } catch (err: any) {
    // Amaç projeyi uyandırmak; hata olsa bile 200 döndürmek isteyebilirsiniz
    // Ancak logging için hata mesajını da döndürüyoruz
    console.error("Heartbeat error:", err?.message);
    return NextResponse.json(
      {
        ok: false,
        error: err?.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
