'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  Lock,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Focus first OTP input on step change
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [step]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const otpValue = otp.join('');

  const handleRequestOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep('otp');
        setCountdown(60);
        setOtp(Array(6).fill(''));
        toast.success('OTP sent to your mobile number');
      } else {
        toast.error(data.error || 'Failed to send OTP');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (otpValue.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp: otpValue }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Welcome! Redirecting...');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Invalid OTP');
        setOtp(Array(6).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#002970] via-[#001d52] to-[#00112e] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-gradient-to-br from-[#00B9F1] to-[#0077B6] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">P</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              PaySecure
            </span>
          </Link>

          {/* Center Content */}
          <div className="space-y-8 max-w-md">
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Secure payments,
              <br />
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                simplified.
              </span>
            </h2>
            <p className="text-blue-100/50 text-lg leading-relaxed">
              Log in with your mobile number and OTP. No passwords to remember, no
              security compromises.
            </p>

            {/* Features */}
            <div className="space-y-4 pt-4">
              {[
                {
                  icon: <ShieldCheck size={20} />,
                  text: 'OTP hashed with bcrypt encryption',
                },
                { icon: <Lock size={20} />, text: 'JWT tokens in HTTP-only cookies' },
                {
                  icon: <Smartphone size={20} />,
                  text: 'Passwordless mobile-first auth',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-blue-100/70 text-sm font-medium">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-blue-100/30 text-sm">
            &copy; 2026 PaySecure Technologies Pvt. Ltd.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50/50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="lg:hidden flex items-center gap-2.5 mb-10 justify-center"
          >
            <div className="h-10 w-10 bg-gradient-to-br from-[#00B9F1] to-[#0077B6] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-extrabold text-xl">P</span>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#002970]">
              PaySecure
            </span>
          </Link>

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="space-y-2 mb-8">
                  <h1 className="text-3xl font-extrabold text-[#002970]">
                    Welcome back
                  </h1>
                  <p className="text-gray-500">
                    Enter your mobile number to sign in or create an account.
                  </p>
                </div>

                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center border-r border-gray-200 bg-gray-50 rounded-l-xl">
                        <span className="text-gray-500 font-semibold text-sm">+91</span>
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        className="block w-full rounded-xl border border-gray-200 pl-20 pr-4 py-4 text-lg font-medium text-gray-900 placeholder:text-gray-400 focus:border-[#00B9F1] focus:ring-2 focus:ring-[#00B9F1]/20 transition-all bg-white"
                        placeholder="9876543210"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))
                        }
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    disabled={loading || phoneNumber.length < 10}
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#00B9F1] to-[#0077B6] py-4 text-lg font-bold text-white hover:shadow-lg hover:shadow-blue-200/50 focus:outline-none focus:ring-2 focus:ring-[#00B9F1] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-8">
                  By continuing, you agree to our{' '}
                  <Link href="#" className="text-[#00B9F1] hover:underline">
                    Terms
                  </Link>{' '}
                  &{' '}
                  <Link href="#" className="text-[#00B9F1] hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <button
                  onClick={() => {
                    setStep('phone');
                    setOtp(Array(6).fill(''));
                  }}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#002970] font-medium mb-8 transition-colors"
                >
                  <ArrowLeft size={18} />
                  Change number
                </button>

                <div className="space-y-2 mb-8">
                  <h1 className="text-3xl font-extrabold text-[#002970]">
                    Verify OTP
                  </h1>
                  <p className="text-gray-500">
                    Enter the 6-digit code sent to{' '}
                    <span className="font-semibold text-gray-700">
                      +91 {phoneNumber}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  {/* OTP Boxes */}
                  <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-14 h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 bg-white focus:outline-none ${
                          digit
                            ? 'border-[#00B9F1] bg-blue-50/30 text-[#002970]'
                            : 'border-gray-200 text-gray-900 focus:border-[#00B9F1] focus:ring-2 focus:ring-[#00B9F1]/20'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    disabled={loading || otpValue.length !== 6}
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-[#002970] to-[#001d52] py-4 text-lg font-bold text-white hover:shadow-lg hover:shadow-blue-900/20 focus:outline-none focus:ring-2 focus:ring-[#002970] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        Verify & Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Resend */}
                <div className="mt-8 text-center">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-400">
                      Resend code in{' '}
                      <span className="font-bold text-[#002970] tabular-nums">
                        {String(Math.floor(countdown / 60)).padStart(2, '0')}:
                        {String(countdown % 60).padStart(2, '0')}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestOtp()}
                      disabled={loading}
                      className="text-sm font-bold text-[#00B9F1] hover:text-[#0077B6] transition-colors disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
