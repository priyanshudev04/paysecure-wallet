"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("all");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/wallet/transactions?range=${range}`
        );
        const data = await res.json();

        if (res.ok) {
          setTransactions(data.transactions);
        }
      } catch {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [range]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const lastMonthDate = new Date(thisYear, thisMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  // 🔹 Totals
  const totalIncome = transactions
    .filter((tx) => tx.type === "credit")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const totalExpense = transactions
    .filter((tx) => tx.type === "debit")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  // 🔹 Monthly Income Calculation
  const thisMonthIncome = transactions
    .filter((tx) => {
      const d = new Date(tx.created_at);
      return (
        tx.type === "credit" &&
        d.getMonth() === thisMonth &&
        d.getFullYear() === thisYear
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const lastMonthIncome = transactions
    .filter((tx) => {
      const d = new Date(tx.created_at);
      return (
        tx.type === "credit" &&
        d.getMonth() === lastMonth &&
        d.getFullYear() === lastMonthYear
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const monthlyChange =
    lastMonthIncome === 0
      ? 100
      : ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100;

  // 🔹 Pie Data
  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  // 🔹 Line Chart Data
  const grouped: { [key: string]: number } = {};

  transactions.forEach((tx) => {
    const date = new Date(tx.created_at).toLocaleDateString("en-IN");
    if (!grouped[date]) grouped[date] = 0;
    if (tx.type === "credit") {
      grouped[date] += Number(tx.amount);
    }
  });

  const lineData = Object.keys(grouped).map((date) => ({
    date,
    income: grouped[date],
  }));

  return (
    <div className="p-8 bg-[#F7F8FC] min-h-screen space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#002970]">
          Transactions & Analytics
        </h2>

        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-white text-sm"
        >
          <option value="all">All Time</option>
          <option value="last7days">Last 7 Days</option>
          <option value="thismonth">This Month</option>
          <option value="lastmonth">Last Month</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* Total Income */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <ArrowDownLeft className="text-green-600" />
            <h3 className="font-bold text-lg">Total Income</h3>
          </div>
          <p className="text-2xl font-extrabold text-green-600">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Total Expense */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <ArrowUpRight className="text-red-500" />
            <h3 className="font-bold text-lg">Total Expense</h3>
          </div>
          <p className="text-2xl font-extrabold text-red-500">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="text-blue-600" />
            <h3 className="font-bold text-lg">Monthly Growth</h3>
          </div>

          <p className="text-sm text-gray-500">
            This Month: ₹{thisMonthIncome.toLocaleString("en-IN")}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Last Month: ₹{lastMonthIncome.toLocaleString("en-IN")}
          </p>

          <p
            className={`text-xl font-bold ${
              monthlyChange >= 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {monthlyChange.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Income Trend</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#002970"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-4">Income vs Expense</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between items-center p-4"
          >
            <div>
              <p className="font-semibold">{tx.description}</p>
              <p className="text-xs text-gray-400">
                {new Date(tx.created_at).toLocaleString()}
              </p>
            </div>

            <p
              className={`font-bold ${
                tx.type === "credit"
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {tx.type === "credit" ? "+" : "-"} ₹
              {Number(tx.amount).toLocaleString("en-IN")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
