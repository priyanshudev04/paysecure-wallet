'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Zap,
  Lock,
  ArrowRight,
  CreditCard,
  Banknote,
  QrCode,
  Wallet,
  TrendingUp,
  Globe,
  ChevronRight,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};


export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 bg-gradient-to-br from-[#00B9F1] to-[#0077B6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
            <span className="text-white font-extrabold text-xl">P</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#002970]">
            PaySecure
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <Link href="#features" className="hover:text-[#002970] transition-colors">
            Features
          </Link>
          <Link href="#security" className="hover:text-[#002970] transition-colors">
            Security
          </Link>
          <Link href="#services" className="hover:text-[#002970] transition-colors">
            Services
          </Link>
        </div>
        <Link
          href="/login"
          className="rounded-full bg-[#002970] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#001d52] transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
        >
          Sign In
          <ArrowRight size={16} />
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative px-6 pt-32 pb-20 md:px-12 md:pt-44 md:pb-32 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-50 via-cyan-50/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-50 via-blue-50/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-cyan-100/20 to-blue-100/20 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left content */}
            <motion.div
              className="flex-1 space-y-8 text-center lg:text-left"
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 text-sm font-semibold text-[#0077B6]"
                variants={fadeUp}
                custom={0}
              >
                <ShieldCheck size={16} />
                Bank-grade OTP Security
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-[#002970] tracking-tight"
                variants={fadeUp}
                custom={1}
              >
                The Future of{' '}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-[#00B9F1] to-[#0077B6] bg-clip-text text-transparent">
                    Digital Payments
                  </span>
                  <span className="absolute bottom-2 left-0 right-0 h-3 bg-cyan-200/40 -z-0 rounded-full" />
                </span>{' '}
                is Here.
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                variants={fadeUp}
                custom={2}
              >
                Send money, pay bills, recharge, and invest — all from one secure
                platform. Protected by advanced OTP verification and JWT encryption.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={fadeUp}
                custom={3}
              >
                <Link
                  href="/login"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#00B9F1] to-[#0077B6] px-8 py-4 text-lg font-bold text-white hover:shadow-xl hover:shadow-blue-300/30 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get Started Free
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-gray-200 px-8 py-4 text-lg font-bold text-[#002970] hover:border-[#00B9F1] hover:bg-blue-50/50 transition-all"
                >
                  Learn More
                </Link>
              </motion.div>

              <motion.div
                className="flex items-center gap-6 justify-center lg:justify-start pt-4"
                variants={fadeUp}
                custom={4}
              >
                <div className="flex -space-x-3">
                  {['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map(
                    (color, i) => (
                      <div
                        key={i}
                        className={`h-10 w-10 rounded-full ${color} border-[3px] border-white flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    )
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={14}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm font-bold text-gray-700 ml-1">4.9</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    450M+ trusted users
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Phone mockup */}
            <motion.div
              className="flex-1 relative w-full max-w-sm lg:max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="relative">
                {/* Floating cards */}
                <motion.div
                  className="absolute -left-12 top-16 z-10 bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 border border-gray-100"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Received</p>
                      <p className="text-sm font-bold text-green-600">+ ₹5,000</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-8 bottom-32 z-10 bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4 border border-gray-100"
                  animate={{ y: [0, 10, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Secured</p>
                      <p className="text-sm font-bold text-[#002970]">OTP Verified</p>
                    </div>
                  </div>
                </motion.div>

                {/* Phone */}
                <div className="aspect-[9/19] bg-gradient-to-b from-gray-900 to-gray-800 rounded-[3rem] border-[6px] border-gray-700 shadow-2xl shadow-gray-400/30 relative overflow-hidden mx-auto">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-gray-800 rounded-b-2xl z-10" />
                  <div className="p-5 pt-12 space-y-4 h-full bg-gradient-to-b from-[#002970] to-[#001845]">
                    {/* Status bar */}
                    <div className="flex justify-between items-center text-white/60 text-[10px] font-medium px-1">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-white/40 rounded-sm" />
                        <div className="w-4 h-2 bg-white/40 rounded-sm" />
                        <div className="w-6 h-2.5 bg-green-400 rounded-sm" />
                      </div>
                    </div>
                    {/* Balance */}
                    <div className="text-center pt-4">
                      <p className="text-white/50 text-xs font-medium">Total Balance</p>
                      <p className="text-white text-3xl font-extrabold mt-1">
                        ₹1,24,500
                      </p>
                    </div>
                    {/* Quick actions */}
                    <div className="grid grid-cols-4 gap-2 pt-2">
                      {[
                        { icon: <Banknote size={18} />, label: 'Pay' },
                        { icon: <QrCode size={18} />, label: 'Scan' },
                        { icon: <Smartphone size={18} />, label: 'Mobile' },
                        { icon: <CreditCard size={18} />, label: 'Cards' },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-white/10"
                        >
                          <div className="text-white/80">{item.icon}</div>
                          <span className="text-[10px] text-white/60 font-medium">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Transactions */}
                    <div className="bg-white/10 rounded-2xl p-3 space-y-3 mt-2">
                      <p className="text-white/60 text-xs font-semibold">Recent</p>
                      {[
                        { name: 'JIO Recharge', amt: '-₹749', color: 'text-red-300' },
                        { name: 'From Bank', amt: '+₹5,000', color: 'text-green-300' },
                        { name: 'Starbucks', amt: '-₹350', color: 'text-red-300' },
                      ].map((t, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-white/10" />
                            <span className="text-white/80 text-xs font-medium">
                              {t.name}
                            </span>
                          </div>
                          <span className={`text-xs font-bold ${t.color}`}>
                            {t.amt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Glow effects */}
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-cyan-400 rounded-full blur-[80px] opacity-20" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-blue-500 rounded-full blur-[80px] opacity-15" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-[#002970] py-12 md:py-16">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6 text-center">
            {[
              { value: '450M+', label: 'Active Users' },
              { value: '₹2.3T', label: 'Monthly Volume' },
              { value: '99.99%', label: 'Uptime SLA' },
              { value: '<100ms', label: 'Avg Response' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-extrabold text-white">
                  {stat.value}
                </p>
                <p className="text-blue-200/70 text-sm font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 py-24 md:px-12 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <span className="text-sm font-bold text-[#00B9F1] uppercase tracking-widest">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#002970]">
              Everything You Need
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              A comprehensive payment platform built with security-first architecture
              and blazing-fast performance.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Smartphone className="text-blue-500" size={24} />,
                bg: 'bg-blue-50',
                title: 'Mobile-First Design',
                desc: 'Seamless experience optimized for every device and screen size.',
              },
              {
                icon: <ShieldCheck className="text-emerald-500" size={24} />,
                bg: 'bg-emerald-50',
                title: 'OTP Authentication',
                desc: 'Bcrypt-hashed OTPs stored in Redis with 5-minute expiry and attempt limits.',
              },
              {
                icon: <Zap className="text-amber-500" size={24} />,
                bg: 'bg-amber-50',
                title: 'Instant Transfers',
                desc: 'Send and receive money in real-time through UPI, wallet, or bank transfer.',
              },
              {
                icon: <Lock className="text-purple-500" size={24} />,
                bg: 'bg-purple-50',
                title: 'JWT Token Security',
                desc: 'Access and refresh token rotation with HTTP-only secure cookies.',
              },
              {
                icon: <Globe className="text-cyan-500" size={24} />,
                bg: 'bg-cyan-50',
                title: 'Rate Limiting',
                desc: 'Redis-powered rate limiting prevents abuse and brute-force attacks.',
              },
              {
                icon: <CreditCard className="text-rose-500" size={24} />,
                bg: 'bg-rose-50',
                title: 'Multi-Payment',
                desc: 'Pay bills, recharge, shop online — all within a single unified platform.',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="group p-8 rounded-3xl border border-gray-100 bg-white hover:shadow-2xl hover:shadow-gray-100/80 transition-all duration-300 hover:-translate-y-1 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  className={`h-14 w-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#002970] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section
          id="services"
          className="px-6 py-24 md:px-12 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <span className="text-sm font-bold text-[#00B9F1] uppercase tracking-widest">
                Services
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#002970]">
                What You Can Do
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Banknote size={28} />,
                  title: 'Money Transfer',
                  desc: 'Send money instantly to any bank account or wallet with zero fees.',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: <Smartphone size={28} />,
                  title: 'Mobile Recharge',
                  desc: 'Recharge prepaid, postpaid, DTH, and broadband in seconds.',
                  gradient: 'from-violet-500 to-purple-500',
                },
                {
                  icon: <Zap size={28} />,
                  title: 'Bill Payments',
                  desc: 'Pay electricity, gas, water, and insurance bills seamlessly.',
                  gradient: 'from-amber-500 to-orange-500',
                },
                {
                  icon: <TrendingUp size={28} />,
                  title: 'Investments',
                  desc: 'Invest in mutual funds, stocks, and digital gold from your wallet.',
                  gradient: 'from-emerald-500 to-green-500',
                },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-100/80 transition-all duration-300 flex gap-6 items-start"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-white shrink-0 shadow-lg`}
                  >
                    {service.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#002970] flex items-center gap-2">
                      {service.title}
                      <ChevronRight
                        size={18}
                        className="text-gray-300 group-hover:text-[#00B9F1] group-hover:translate-x-1 transition-all"
                      />
                    </h3>
                    <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Highlight */}
        <section id="security" className="px-6 py-24 md:px-12">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="relative rounded-[2.5rem] bg-gradient-to-br from-[#002970] via-[#001d52] to-[#00112e] p-12 md:p-16 overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                  }}
                />
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />

              <div className="relative flex flex-col md:flex-row items-center gap-10">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shrink-0 shadow-2xl shadow-cyan-500/30">
                  <Lock className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                    Enterprise-Grade Security
                  </h2>
                  <p className="text-blue-100/60 text-lg leading-relaxed max-w-2xl">
                    Every transaction is protected with bcrypt-hashed OTPs, JWT token
                    rotation, Redis-backed rate limiting, and HTTP-only secure cookies.
                    Your data never leaves encrypted channels.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                    {[
                      'Bcrypt Hashing',
                      'JWT Rotation',
                      'Rate Limiting',
                      'HTTP-Only Cookies',
                      'HTTPS Only',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-medium border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#002970]">
              Ready to Get Started?
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Join millions of users who trust PaySecure for their everyday payments.
              Sign up with just your mobile number.
            </p>
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#00B9F1] to-[#0077B6] px-10 py-5 text-lg font-bold text-white hover:shadow-xl hover:shadow-blue-300/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Create Your Account
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-16 md:px-12 border-t bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 bg-gradient-to-br from-[#00B9F1] to-[#0077B6] rounded-lg flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">P</span>
                </div>
                <span className="text-lg font-extrabold tracking-tight text-[#002970]">
                  PaySecure
                </span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                India&apos;s most trusted digital payments platform, secured with
                enterprise-grade authentication.
              </p>
            </div>
            {[
              {
                title: 'Product',
                links: ['Payments', 'Wallet', 'Recharge', 'Insurance'],
              },
              {
                title: 'Company',
                links: ['About Us', 'Careers', 'Blog', 'Press'],
              },
              {
                title: 'Legal',
                links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-[#002970] mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="text-sm text-gray-500 hover:text-[#00B9F1] transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2026 PaySecure Technologies Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="#" className="hover:text-gray-600">
                Twitter
              </Link>
              <Link href="#" className="hover:text-gray-600">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-gray-600">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
