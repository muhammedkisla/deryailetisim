# Supabase Kurulum Rehberi

Bu dokümanda Derya İletişim projesi için Supabase entegrasyonu adımları açıklanmaktadır.

## 1. Supabase Projesi Oluşturma

1. [Supabase](https://supabase.com) sitesine gidin ve hesap oluşturun
2. Yeni bir proje oluşturun
3. Proje URL'si ve Anon Key'i kopyalayın

## 2. Database Tabloları

### Phones Tablosu

```sql
-- Telefonlar tablosu
create table phones (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  brand text not null,
  model text not null,
  cash_price numeric(10,2) not null,
  single_payment_rate numeric(4,2) default 1.05,
  installment_rate numeric(4,2) default 1.15,
  image_url text,
  stock boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) politikaları
alter table phones enable row level security;

-- Herkes okuyabilir
create policy "Phones are viewable by everyone"
  on phones for select
  using (true);

-- Sadece admin kullanıcılar ekleyebilir, güncelleyebilir ve silebilir
create policy "Admins can insert phones"
  on phones for insert
  with check (auth.role() = 'authenticated');

create policy "Admins can update phones"
  on phones for update
  using (auth.role() = 'authenticated');

create policy "Admins can delete phones"
  on phones for delete
  using (auth.role() = 'authenticated');

-- Updated_at otomatik güncelleme için trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_phones_updated_at
  before update on phones
  for each row
  execute procedure update_updated_at_column();
```

### Contact Info Tablosu (Opsiyonel)

```sql
-- İletişim bilgileri tablosu
create table contact_info (
  id uuid default uuid_generate_v4() primary key,
  phone text not null,
  email text not null,
  address text not null,
  working_hours text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table contact_info enable row level security;

create policy "Contact info is viewable by everyone"
  on contact_info for select
  using (true);

create policy "Admins can update contact info"
  on contact_info for update
  using (auth.role() = 'authenticated');
```

## 3. Authentication Kurulumu

### Admin Kullanıcı Oluşturma

1. Supabase Dashboard'da Authentication > Users bölümüne gidin
2. "Add User" butonuna tıklayın
3. Admin e-posta ve şifresini girin
4. Kullanıcıyı oluşturun

## 4. Proje Konfigürasyonu

1. `.env.local.example` dosyasını `.env.local` olarak kopyalayın:

   ```bash
   cp .env.local.example .env.local
   ```

2. `.env.local` dosyasını düzenleyin ve Supabase bilgilerinizi ekleyin:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 5. Supabase Client Kurulumu

Supabase paketini yükleyin:

```bash
npm install @supabase/supabase-js
```

## 6. Kod Güncellemeleri

### src/lib/supabase.ts Güncellemesi

Dosyadaki yorum satırlarını kaldırın ve aktif hale getirin:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### API Routes Oluşturma

Telefon CRUD işlemleri için API routes oluşturun:

#### src/app/api/phones/route.ts

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Tüm telefonları getir
export async function GET() {
  const { data, error } = await supabase
    .from("phones")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST - Yeni telefon ekle
export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase.from("phones").insert([body]).select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}
```

#### src/app/api/phones/[id]/route.ts

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT - Telefonu güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("phones")
    .update(body)
    .eq("id", params.id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}

// DELETE - Telefonu sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase.from("phones").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

## 7. Storage Kurulumu (Telefon Görselleri için)

1. Supabase Dashboard'da Storage bölümüne gidin
2. "phone-images" adında bir bucket oluşturun
3. Bucket'ı public yapın
4. Upload politikası ekleyin:

```sql
create policy "Anyone can upload phone images"
  on storage.objects for insert
  with check (bucket_id = 'phone-images');

create policy "Anyone can view phone images"
  on storage.objects for select
  using (bucket_id = 'phone-images');
```

## 8. Test Etme

1. Projeyi başlatın:

   ```bash
   npm run dev
   ```

2. Admin paneline giriş yapın:

   - URL: http://localhost:3000/admin/login
   - Supabase'de oluşturduğunuz admin e-posta ve şifresini kullanın

3. Telefon ekleyin ve listeyi kontrol edin

## Güvenlik Notları

- `.env.local` dosyasını asla Git'e commit etmeyin
- Production'da Service Role Key'i sadece sunucu tarafında kullanın
- RLS politikalarını düzenli olarak gözden geçirin
- Admin yetkilerini dikkatli yönetin

## Sonraki Adımlar

- [ ] Supabase Auth entegrasyonunu tamamlayın
- [ ] Image upload özelliğini ekleyin
- [ ] Real-time updates ekleyin (opsiyonel)
- [ ] Backup stratejisi oluşturun
