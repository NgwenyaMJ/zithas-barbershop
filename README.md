# Zithas Barbershop

A modern Next.js starter for the Zithas Barbershop website and appointment/queue management product.

## Included

- Responsive premium dark-and-gold marketing website
- Services catalogue and pricing
- Appointment request form
- Booking reference generation and lookup
- Staff dashboard starter with booking status controls
- Live queue page layout (currently clearly labelled sample data)
- Supabase SQL schema for profiles, services, barbers, bookings and queue entries
- GitHub and Vercel-ready project structure

## Important implementation status

This is a substantial working starter, not a finished production system.

- Booking creation, lookup and staff listing require Supabase configuration.
- The queue page currently shows sample data; queue management API and realtime subscriptions still need implementation.
- The staff PIN screen is a local demo gate only. It is NOT secure authentication. Replace it with Supabase Auth and server-side role checks before public launch.
- API routes currently use a Supabase service-role key. Add staff authorization, rate limiting, validation and abuse protection before production.
- No payment processing is included.
- Opening hours, location, contact details, staff names and prices are starter content and must be verified with the business owner.

## Requirements

- Node.js 20 or newer recommended
- npm
- Supabase project (for persistent bookings)

## Run locally

1. Extract the ZIP.
2. Open CMD/PowerShell in the project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Copy `.env.example` to `.env.local`.
5. Create a Supabase project and run `supabase/schema.sql` in its SQL Editor.
6. Add these values to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
   ```

   The service role key is secret. Never prefix it with `NEXT_PUBLIC_`, never commit `.env.local`, and never paste it into chat.

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Visit http://localhost:3000.

Without Supabase credentials, the public pages render, but booking submission, lookup and dashboard data will show a configuration message.

## Main routes

- `/` Home
- `/book` Appointment booking
- `/queue` Queue preview
- `/track` Booking lookup
- `/admin` Staff dashboard starter
- `/api/bookings` Booking API

## Before deployment

- Verify business details, pricing, barber roster and working hours.
- Implement Supabase Auth and role-based authorization.
- Secure the API routes and booking lookup (avoid exposing customer personal information).
- Implement queue join/call/complete operations and realtime updates.
- Add privacy notice and POPIA-compliant handling of personal information.
- Add server-side booking availability/conflict checks.
- Configure production environment variables in Vercel.
- Test on mobile and desktop.

## Deploy to Vercel

Push the project to GitHub, import the repository in Vercel, set the environment variables in Vercel Project Settings, then deploy. Use `npm run build` locally before deployment.
