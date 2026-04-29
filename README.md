# 📱 ApnaCRM – WhatsApp CRM Lite

> Pakistani small businesses ke liye sabse aasaan CRM

---

## 🚀 Quick Setup Guide

### Step 1 – Supabase Setup

1. [supabase.com](https://supabase.com) par naya project banayein
2. **SQL Editor** mein jao → `supabase-schema.sql` ka sara content paste karo → Run karo
3. **Settings → API** mein jao aur ye copy karo:
   - `Project URL`
   - `anon public` key

### Step 2 – Environment Variables

```bash
cp .env.local.example .env.local
```

`.env.local` mein apni values daalo:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3 – Local Development

```bash
npm install
npm run dev
```

Browser mein kholein: `http://localhost:3000`

---

## 🌐 Vercel Deployment

1. GitHub par repository banayein aur code push karein
2. [vercel.com](https://vercel.com) par jao → **New Project** → GitHub se import karein
3. **Environment Variables** add karein (same as .env.local)
4. **Deploy** dabayein ✅

---

## 📁 Project Structure

```
apnacrm/
├── app/
│   ├── (auth)/
│   │   ├── login/          ← Login page
│   │   └── register/       ← Register page
│   ├── (dashboard)/
│   │   ├── layout.tsx      ← Sidebar + bottom nav
│   │   ├── page.tsx        ← Dashboard with stats
│   │   ├── customers/      ← Customer list, add, edit
│   │   └── followups/      ← Today's follow-ups
│   └── globals.css
├── components/             ← Reusable UI components
├── lib/                    ← Supabase client + types
├── middleware.ts            ← Auth route protection
└── supabase-schema.sql     ← Database setup SQL
```

---

## 🗄 Database Schema

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Auth user reference |
| name | text | Customer naam |
| phone | text | Phone number |
| source | text | WhatsApp / Instagram / Other |
| status | text | New Lead / Interested / Ordered / Completed / Lost |
| notes | text | Extra notes |
| follow_up_date | date | Follow-up ki tarikh |
| created_at | timestamptz | Creation time |

---

## 🔒 Security

- **Row Level Security (RLS)** enabled — har user sirf apna data dekh sakta hai
- **Supabase Auth** — email/password authentication
- **Middleware** — unauthenticated users automatically `/login` par redirect hote hain

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **Deployment**: Vercel
- **Code**: GitHub

---

## 🔮 Future Features (Phase 2)

- [ ] WhatsApp API integration
- [ ] Bulk message send
- [ ] AI-powered follow-up suggestions
- [ ] Analytics dashboard
- [ ] Team management
- [ ] Export to Excel

---

Made with ❤️ for Pakistani businesses
