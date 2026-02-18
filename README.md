# 💳 PaySecure – Full Stack Digital Wallet with OTP Authentication

PaySecure is a secure full-stack digital wallet application built with **Next.js, Supabase, Redis, and JWT authentication**.  
It demonstrates complete backend + frontend integration including OTP login, wallet system, transaction tracking, security features, and analytics.

---

## 🚀 Live Features

- 🔐 OTP-based Authentication (Redis + bcrypt)
- 💰 Wallet System (Add / Send Money)
- 🔑 Transaction PIN Security
- 📊 Expense & Income Analytics with Charts
- 👤 Editable Profile with Avatar Upload
- 🛡 Enterprise-grade Security Architecture
- 📦 Supabase Database Integration
- ⚡ Redis Rate Limiting
- 🍪 Secure HTTP-only JWT Cookies

---

## 🛠 Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts

### Backend
- Supabase (PostgreSQL + Storage)
- Upstash Redis
- JWT Authentication
- bcrypt Hashing

### Deployment
- Vercel (Frontend + API Routes)
- Supabase (Database + Storage)
- Upstash (Redis)

---

## 🔐 Authentication Flow

1. User enters phone number
2. OTP generated and stored in Redis (hashed)
3. OTP verified
4. JWT Access & Refresh tokens issued
5. Stored in HTTP-only secure cookies

---

## 💰 Wallet System

- Add Money
- Send Money (Phone Number or QR simulated)
- Balance auto-updates
- Transaction history stored in database
- Income vs Expense analytics
- Monthly comparison chart

---

## 🛡 Security Implementation

- Bcrypt-hashed OTPs
- Redis rate limiting
- JWT access + refresh token rotation
- HTTP-only cookies
- Transaction PIN verification
- Protected API routes
- Server-side token validation
- Supabase RLS-compatible structure

---

## 📊 Analytics

- Total Income
- Total Expense
- Monthly Comparison
- Visual Charts using Recharts
- Sorted real-time transaction history

---

## 📁 Project Structure

src/
├── app/
│ ├── api/
│ ├── dashboard/
│ ├── profile/
│ ├── security/
│ ├── transactions/
│ └── send/
├── lib/
│ ├── auth.ts
│ ├── supabase.ts
│ ├── redis.ts

yaml
Copy code

---

## ⚙️ Environment Variables

Create `.env` file:

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

yaml
Copy code

---

## 🧠 What This Project Demonstrates

✔ Full-stack architecture  
✔ Secure authentication system  
✔ Real database integration  
✔ Protected backend APIs  
✔ Payment flow logic  
✔ Production-level structure  
✔ State management & data fetching  
✔ Storage handling (avatar upload)  

---

## 📈 Why This Project Matters

This project demonstrates strong understanding of:

- Backend security principles
- Token-based authentication
- Database schema design
- API route handling
- Full-stack integration
- Financial transaction logic
- Production-ready app architecture

---

## 👨‍💻 Author

Built by **[Your Name]**  
Full Stack Developer | Backend-Focused | Security-Oriented

---

## ⭐ Future Improvements

- Database transaction atomicity
- 2FA PIN verification step
- Real QR scanner integration
- Admin dashboard
- Role-based access control
- CI/CD pipeline

---

# 🚀 Ready to Deploy
