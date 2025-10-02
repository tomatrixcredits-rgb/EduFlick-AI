# Editing course design

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/aaron-r-thomas-projects/v0-editing-course-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/tJmNPTvZH5W)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/aaron-r-thomas-projects/v0-editing-course-design](https://vercel.com/aaron-r-thomas-projects/v0-editing-course-design)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/tJmNPTvZH5W](https://v0.app/chat/projects/tJmNPTvZH5W)**

## Supabase configuration & authentication flow

### 1. Create a Supabase project

1. Sign in to [Supabase](https://supabase.com/) and create a new project.
2. Copy the project URL and the public `anon` key from **Project Settings → API**.
3. Copy the `service_role` key from the same page. Keep it secret – it has elevated privileges.

### 2. Configure environment variables

Add the following variables to your local `.env.local` file and to the hosting platform (e.g. Vercel) so the app can talk to Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="supabase-public-anon-key"
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="supabase-service-role-key"
```

The public keys power the in-browser authentication flow, while the service role is only used by the API route to write registrations securely.

### 3. Provision the database

Create a `registrations` table to store onboarding submissions:

```sql
create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  track text not null
);

alter table registrations enable row level security;

create policy "Only service role can insert" on registrations
  for insert with check (auth.role() = 'service_role');
```

Because inserts come from the service role key, no additional public policies are required.

### 4. How authentication works in the app

* `/signin` presents a combined sign-in/sign-up form. It calls `supabase.auth.signUp` to create an account or `supabase.auth.signInWithPassword` to authenticate an existing one. Successful sessions are stored by Supabase in `auth.users`.
* Authenticated users are redirected to `/register`, where we confirm their session via `supabase.auth.getSession`. If no session exists the user is sent back to `/signin`.
* Submitting the registration form triggers `/api/register`. The route uses the server-side Supabase client (authorised with the service role key) to insert the attendee’s details into the `registrations` table.
* After registration the attendee proceeds to `/register/payment`, which repeats the session check before allowing them to launch the Razorpay checkout.

These steps ensure Supabase manages account security, while the application stores onboarding details in a dedicated table tied to the authenticated user journey.

### 5. Enable password reset (Forgot/Reset password)

1. In Supabase Dashboard, go to Auth → Providers → Email and ensure Email auth is enabled.
2. Go to Auth → URL Configuration:
   - Set Site URL to your deployed domain (e.g. `https://your-domain.com`). For local development, Supabase uses this value to build redirect URLs.
   - Add the following to Additional Redirect URLs:
     - `http://localhost:3000/reset-password`
     - `https://your-domain.com/reset-password`
3. Optional: Customize the Reset Password email in Auth → Templates → Reset Password.
4. In the app:
   - Users request a reset at `/forgot-password`. This calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: "<origin>/reset-password" })`.
   - Users receive a magic recovery link. After clicking, Supabase redirects to `/reset-password` with a recovery session.
   - On `/reset-password`, we detect the recovery session and call `supabase.auth.updateUser({ password: "newPassword" })`.

No additional database changes or policies are required for this flow.

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository