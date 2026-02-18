import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "PaySecure - Smart Wallet & Expense Tracker",
  description: "Modern fintech wallet app with OTP auth, transactions, analytics and secure PIN protection.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
