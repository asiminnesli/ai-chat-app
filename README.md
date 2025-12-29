# AI Chat App 🤖💬

Modern bir yapay zeka sohbet uygulaması. Next.js 16, Supabase ve Groq API kullanılarak geliştirilmiştir. Kullanıcılar farklı AI karakterleri ile sohbet edebilir, kod blokları paylaşabilir ve sohbet geçmişlerini yönetebilir.

## 🚀 Canlı Demo

**[Uygulamayı Test Et →](https://ai-chat-app-five-iota.vercel.app/)**

## 🎥 Demo Video

[![AI Chat App Demo](https://img.youtube.com/vi/3r6rG6-uoqY/maxresdefault.jpg)](https://youtu.be/3r6rG6-uoqY)

[Video'yu İzle](https://youtu.be/3r6rG6-uoqY)

## ✨ Özellikler

- 🔐 **Google OAuth ile Kimlik Doğrulama**: Supabase Auth kullanarak güvenli giriş
- 💬 **Gerçek Zamanlı AI Sohbeti**: Groq API entegrasyonu ile hızlı AI yanıtları
- 👥 **Karakter Seçimi**: Farklı AI karakterleri ile sohbet etme imkanı
- 📝 **Markdown Desteği**: Zengin metin formatlaması
- 💻 **Kod Blokları**: Syntax highlighting ve kopyalama özelliği ile kod paylaşımı
- 📱 **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- 🎨 **Modern UI**: Tailwind CSS ile şık ve kullanıcı dostu tasarım
- 💾 **Sohbet Geçmişi**: Tüm sohbetlerinizi kaydetme ve görüntüleme

## 🛠️ Teknoloji Yığını

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI kütüphanesi
- **TypeScript** - Tip güvenliği
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animasyonlar
- **Lucide React** - İkonlar
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Kod syntax highlighting

### Backend & Database
- **Supabase** - Authentication, Database, Storage
- **Groq API** - AI model entegrasyonu
- **Zustand** - State management

### UI Components
- **Radix UI** - Erişilebilir UI bileşenleri
- **shadcn/ui** - UI component library

## 📋 Önkoşullar

- Node.js 18+ 
- npm veya yarn
- Supabase hesabı
- Groq API anahtarı

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/asiminnesli/ai-chat-app.git
cd ai-chat-app
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your_project_id
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Groq API
GROQ_API_KEY=your_groq_api_key
```

### 4. Supabase Veritabanı Kurulumu

Supabase dashboard'unuzda aşağıdaki tabloları oluşturun:

#### `users` tablosu
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `characters` tablosu
```sql
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_url TEXT,
  description TEXT,
  system_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `chats` tablosu
```sql
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `messages` tablosu
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Google OAuth Yapılandırması

1. Supabase Dashboard > Authentication > Providers'a gidin
2. Google provider'ı etkinleştirin
3. Google Cloud Console'dan OAuth credentials alın
4. Redirect URL'i ayarlayın: `https://your-project-ref.supabase.co/auth/v1/callback`

### 6. Geliştirme Sunucusunu Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

```
ai-chat-app/
├── app/
│   ├── (auth)/
│   │   └── login/              # Giriş sayfası
│   ├── (chat)/
│   │   ├── chat/[id]/          # Tekil sohbet sayfası
│   │   └── new/                # Yeni sohbet başlatma
│   ├── api/
│   │   └── chat/               # AI API endpoints
│   ├── auth/
│   │   └── callback/           # OAuth callback
│   ├── chats/                  # Sohbet listesi
│   ├── globals.css             # Global stiller
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Ana sayfa
├── components/
│   ├── character/
│   │   └── character-card.tsx  # Karakter kartı
│   ├── chat/
│   │   ├── bubble.tsx          # Sohbet balonu
│   │   └── ChatInput.tsx       # Mesaj input'u
│   ├── layout/
│   │   └── AppHeader.tsx       # Uygulama başlığı
│   └── ui/                     # Shadcn UI bileşenleri
├── lib/
│   ├── supabase/               # Supabase clients
│   ├── formatChatTime.ts       # Zaman formatlama
│   └── utils.ts                # Yardımcı fonksiyonlar
├── public/
│   └── avatars/                # Karakter avatarları
├── store/                      # Zustand stores
└── types/                      # TypeScript types
```

## 🎯 Kullanım

### Giriş Yapma
1. Ana sayfadaki "Sign in with Google" butonuna tıklayın
2. Google hesabınızla giriş yapın

### Yeni Sohbet Başlatma
1. Ana sayfadan bir karakter seçin
2. Veya "New Chat" butonuna tıklayarak karakter seçin
3. Mesajınızı yazın ve gönderin

### Kod Blokları Kullanma
AI yanıtlarında kod blokları otomatik olarak formatlanır:
- Syntax highlighting ile renklendirilir
- Kod bloğunun üzerine gelince kopyalama butonu görünür
- Dil desteği: JavaScript, Python, TypeScript, vb.

### Sohbet Geçmişi
- "Chats" sayfasından tüm geçmiş sohbetlerinizi görüntüleyin
- Sohbetlere tıklayarak devam edin

## 🔧 Yapılandırma

### AI Model Ayarları

`app/api/chat/route.ts` dosyasında AI model parametrelerini düzenleyebilirsiniz:

```typescript
const chatCompletion = await groq.chat.completions.create({
  messages: messages,
  model: "llama-3.3-70b-versatile", // Model seçimi
  temperature: 0.7,                  // Yaratıcılık seviyesi
  max_tokens: 2048,                  // Maksimum token sayısı
});
```

### Stil Özelleştirme

`tailwind.config.ts` dosyasında tema renklerini ve stilleri özelleştirebilirsiniz.

## 📦 Production Build

```bash
# Build oluştur
npm run build

# Production sunucusunu başlat
npm start
```

## 🔒 Güvenlik

- API anahtarlarını asla commit etmeyin
- `.env.local` dosyası `.gitignore` içinde olmalı
- Production'da HTTPS kullanın
- Supabase Row Level Security (RLS) politikalarını aktif edin

### Örnek RLS Politikaları

```sql
-- Users can only read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can only create/read/update their own chats
CREATE POLICY "Users can manage own chats" ON chats
  FOR ALL USING (auth.uid() = user_id);
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👤 İletişim

Asım Yılmaz - [@asiminnesli](https://github.com/asiminnesli)

Proje Linki: [https://github.com/asiminnesli/ai-chat-app](https://github.com/asiminnesli/ai-chat-app)

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Groq](https://groq.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
