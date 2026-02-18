## Project Summary
Secure OTP-based authentication system for a Paytm-like web application using Next.js, Supabase, and Upstash Redis.

## Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, Framer Motion, Radix UI (Input OTP)
- Backend: Next.js API Routes (Node.js runtime)
- Database: Supabase (PostgreSQL)
- Cache: Upstash Redis (OTP storage & rate limiting)
- Auth: JWT (Access/Refresh tokens) in HTTP-only cookies
- Utilities: bcrypt (hashing), jsonwebtoken

## Architecture
- `src/app/api/auth/*`: API endpoints for OTP request, verification, and session management
- `src/lib/*`: Shared utilities for Auth, Redis, and Supabase client
- `src/middleware.ts`: Route protection for `/dashboard` and `/profile`
- `src/app/login`: Authentication UI

## User Preferences
- No password authentication
- Mobile number based login/signup
- 6-digit OTP hashed before storage
- Refresh token rotation logic (standard 7 days)

## Project Guidelines
- Use HTTP-only cookies for JWT storage
- Implement rate limiting for OTP requests
- Use production-grade hashing (bcrypt)
- Ensure clean, fintech-style UI components
