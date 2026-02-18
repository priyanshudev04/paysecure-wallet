'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  Wallet,
  Send,
  Plus,
  History,
  Bell,
  Search,
  Smartphone,
  Zap,
  CreditCard,
  User,
  LayoutDashboard,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Banknote,
  TrendingUp,
  Eye,
  EyeOff,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { toast } from 'sonner';


export default function DashboardPage() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("/api/wallet/me");
        const data = await res.json();

        if (res.ok) {
          setBalance(data.balance);
        }
      } catch (err) {
        console.error("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/wallet/transactions");
        const data = await res.json();

        if (res.ok) {
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/login');
    } catch {
      toast.error('Failed to logout');
    }
  };
  const handleAddMoney = async () => {
    if (!addAmount || Number(addAmount) <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/wallet/add-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(addAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success("Money added successfully");
      setAddAmount("");
      setBalance(prev => prev + Number(addAmount));
 
    } catch {
      toast.error("Failed to add money");
    } finally {
      setLoading(false);
    }
  };

 const sidebarItems = [
  { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
  { id: 'transactions', icon: <History size={20} />, label: 'Transactions', path: '/transactions' },
  
  { id: 'profile', icon: <User size={20} />, label: 'Profile', path: '/profile' },
  { id: 'security', icon: <ShieldCheck size={20} />, label: 'Security', path: '/security' },
];


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F8FC]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-white border-r border-gray-100 fixed h-full z-20">
        <div className="p-6 flex items-center gap-2.5">
          <div className="h-9 w-9 bg-gradient-to-br from-[#00B9F1] to-[#0077B6] rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/30">
            <span className="text-white font-extrabold text-base">P</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#002970]">
            PaySecure
          </span>
        </div>

        <nav className="flex-grow px-4 pt-2 space-y-1">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold px-3 mb-3">
            Menu
          </p>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}

              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeNav === item.id
                  ? 'bg-gradient-to-r from-blue-50 to-cyan-50 text-[#00B9F1] font-bold shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-[#002970]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {activeNav === item.id && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#00B9F1]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mx-4 mb-4 rounded-2xl bg-gradient-to-br from-[#002970] to-[#001845] text-white">
          <p className="text-sm font-bold mb-1">Upgrade to Pro</p>
          <p className="text-xs text-blue-200/60 mb-3">
            Get premium features and higher limits.
          </p>
          <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm font-bold transition-all">
            Upgrade Now
          </button>
        </div>

        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:ml-72">
        {/* Header */}
        <header className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 lg:px-10 py-4 flex items-center justify-between z-10">
          <div>
            <h1 className="text-xl font-extrabold text-[#002970]">
              Good Morning! 
            </h1>
            <p className="text-sm text-gray-400 font-medium">
              Here&apos;s your financial overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-60 bg-gray-100/80 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B9F1]/20 focus:bg-white border border-transparent focus:border-[#00B9F1]/30 transition-all"
              />
            </div>
            <button className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center relative transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00B9F1] to-[#0077B6] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-200/30 cursor-pointer">
              U
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto w-full">
          {/* Balance + Quick Pay Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Balance Card */}
            <motion.div
              className="lg:col-span-2 relative rounded-3xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#002970] via-[#001d52] to-[#00112e]" />
              <div className="absolute inset-0 opacity-5">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                  }}
                />
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />

              <div className="relative p-8 lg:p-10">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-blue-200/60 text-sm font-medium">
                        Total Balance
                      </p>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-blue-200/40 hover:text-blue-200/70 transition-colors"
                      >
                        {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                      {showBalance
  ? `₹${Number(user?.balance ?? 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
    })}`
  : '₹ ••••••'}

                    </h2>
                  </div>
                  <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-green-400 text-sm font-bold">+12.5%</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2">
  <input
    type="number"
    placeholder="Enter amount"
    value={addAmount}
    onChange={(e) => setAddAmount(e.target.value)}
    className="px-3 py-2 rounded-lg text-black text-sm"
  />

  <button
    onClick={handleAddMoney}
    disabled={loading}
    className="bg-gradient-to-r from-[#00B9F1] to-[#0077B6] px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 text-sm"
  >
    <Plus size={18} />
    {loading ? "Adding..." : "Add Money"}
  </button>
</div>

                 <button
  onClick={() => router.push("/wallet/send")}
  className="bg-white/10 hover:bg-white/15 px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 text-sm backdrop-blur-sm"
>
  <Send size={18} />
  Send Money
</button>

                  <button className="bg-white/10 hover:bg-white/15 px-6 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 text-sm backdrop-blur-sm">
                    <QrCode size={18} />
                    Scan & Pay
                  </button>
                </div>
              </div>
            </motion.div>

           
            
          </div>

          {/* Cards Row */}
          <div className="grid md:grid-cols-3 gap-6">
            {([
              {
                title: 'Income',
                amount: '₹45,200',
                change: '+8.2%',
                icon: <ArrowDownLeft size={20} />,
                bgIcon: 'bg-green-50',
                textIcon: 'text-green-600',
                changeColor: 'text-green-600 bg-green-50',
              },
              {
                title: 'Expenses',
                amount: '₹18,750',
                change: '-3.1%',
                icon: <ArrowUpRight size={20} />,
                bgIcon: 'bg-red-50',
                textIcon: 'text-red-500',
                changeColor: 'text-red-500 bg-red-50',
              },
              {
                title: 'Savings',
                amount: '₹26,450',
                change: '+15.4%',
                icon: <TrendingUp size={20} />,
                bgIcon: 'bg-blue-50',
                textIcon: 'text-blue-600',
                changeColor: 'text-blue-600 bg-blue-50',
              },
            ]).map((card, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-10 w-10 rounded-xl ${card.bgIcon} flex items-center justify-center ${card.textIcon}`}
                  >
                    {card.icon}
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.changeColor}`}
                  >
                    {card.change}
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-medium">{card.title}</p>
                <p className="text-2xl font-extrabold text-[#002970] mt-1">
                  {card.amount}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Transactions List */}
          <div className="space-y-1">
            {[...transactions]
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-8 py-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-[#002970] text-sm">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {tx.source || "Wallet"} •{" "}
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold text-sm ${
                        tx.type === "credit"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"} ₹
                      {Number(tx.amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-2 py-2 flex justify-around z-20">
        {([
          { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Home' },
          { id: 'wallet', icon: <Wallet size={20} />, label: 'Wallet' },
          { id: 'send', icon: <Send size={20} />, label: 'Send' },
          { id: 'transactions', icon: <History size={20} />, label: 'History' },
          { id: 'profile', icon: <User size={20} />, label: 'Profile' },
        ]).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              activeNav === item.id
                ? 'text-[#00B9F1]'
                : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}