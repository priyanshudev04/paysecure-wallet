"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function QRPaymentPage() {
  const router = useRouter();
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMoney = async () => {
    if (!receiverPhone || !amount || Number(amount) <= 0) {
      toast.error("Enter valid details");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/wallet/send-money", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverPhone,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return;
      }

      toast.success("Payment successful");
      router.push("/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#002970] font-semibold mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-md p-8 space-y-4">
        <h2 className="text-xl font-bold text-[#002970] text-center">
          Scan QR (Simulated)
        </h2>

        <p className="text-sm text-gray-500 text-center">
          QR scanning simulated. Enter phone manually.
        </p>

        <input
          type="text"
          placeholder="Scanned phone number"
          value={receiverPhone}
          onChange={(e) => setReceiverPhone(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-sm"
        />

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-sm"
        />

        <button
          onClick={handleSendMoney}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#002970] text-white font-bold"
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
}
