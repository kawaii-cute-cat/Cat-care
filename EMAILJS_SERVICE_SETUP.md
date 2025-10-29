## Supabase setup (fresh)

1) In Supabase project, create tables:

```sql
create table profiles (
  id uuid primary key,
  email text unique,
  created_at timestamp with time zone default now()
);

create table cats (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,
  breed text,
  weight_kg numeric,
  created_at timestamp with time zone default now()
);

create table reminders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  title text not null,
  due_at timestamp with time zone not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);
```

2) RLS policies (enable RLS on all tables):

```sql
alter table profiles enable row level security;
alter table cats enable row level security;
alter table reminders enable row level security;

create policy "profiles self access" on profiles
  for select using (auth.uid() = id);

create policy "cats by owner" on cats
  for select using (auth.uid() = owner_id)
  using (auth.uid() = owner_id);

create policy "reminders by owner" on reminders
  for select using (auth.uid() = owner_id)
  using (auth.uid() = owner_id);
```

### If you are not using Supabase Auth (anon key only)

For demos without auth, `auth.uid()` is null, so the policies above block access. Use permissive policies temporarily so the anon key can read/write:

```sql
-- WARNING: Demo-only permissive policies. Do not use in production.
drop policy if exists "profiles self access" on profiles;
drop policy if exists "cats by owner" on cats;
drop policy if exists "reminders by owner" on reminders;

create policy "profiles read anon" on profiles for select using (true);

create policy "cats anon all" on cats
  for select using (true)
  for insert with check (true)
  for update using (true)
  for delete using (true);

create policy "reminders anon all" on reminders
  for select using (true)
  for insert with check (true)
  for update using (true)
  for delete using (true);
```

3) Environment variables in `.env` or Vercel:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

4) Client usage:

```ts
import { supabase } from './lib/supabaseClient'
```
# 🔧 EmailJS Service Setup - Fix Mail Server Connection

## ❌ **Current Issue:**
Your EmailJS is not connected to a mail server. You need to set up an email service in your EmailJS dashboard.

## ✅ **Step-by-Step Fix:**

### 1. **Go to EmailJS Dashboard**
- Visit: https://dashboard.emailjs.com/
- Sign in to your account

### 2. **Create Email Service**
- Click **Email Services** in the left sidebar
- Click **Add New Service**
- Choose your email provider:

#### **Option A: Gmail (Recommended)**
- Select **Gmail**
- Click **Connect Account**
- Sign in with your Gmail account
- Authorize EmailJS to send emails
- **Service ID will be generated** (should be different from `service_sg3gmqr`)

#### **Option B: Outlook**
- Select **Outlook**
- Click **Connect Account**
- Sign in with your Outlook account
- Authorize EmailJS

#### **Option C: Custom SMTP**
- Select **Other (SMTP)**
- Enter your SMTP settings:
  - SMTP Server: `smtp.gmail.com` (for Gmail)
  - Port: `587`
  - Username: Your email
  - Password: Your app password (not regular password)

### 3. **Update Your Configuration**
After creating the service, you'll get a new Service ID. Update your config:

```typescript
// In src/config/emailjs.ts
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_new_service_id', // Replace with actual service ID
  TEMPLATE_ID: 'template_catcare',
  PUBLIC_KEY: '_ahCs4nrRIIr_1d6n'
};
```

### 4. **Test the Connection**
- Go to your app Settings page
- Enable email notifications
- Enter your email address
- Click "Send Test Notification"

## 🚨 **Most Common Issue:**
You're using `service_sg3gmqr` but haven't created this service in your EmailJS dashboard yet.

**Solution:** Create the email service first, then update the service ID in your config.
