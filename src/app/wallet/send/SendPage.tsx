"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, QrCode, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function SendPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toParam = searchParams.get("to");

  const [mode, setMode] = useState<"phone" | "qr" | null>(null);
  const [receiverPhone, setReceiverPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ auto fill if coming from link
  useEffect(() => {
    if (toParam?.trim()) {
      setReceiverPhone(toParam.trim());
      setMode("phone");
    }
  }, [toParam]);

  const handleModeChange = (selected: "phone" | "qr") => {
    setMode(selected);
    setReceiverPhone("");
    setAmount("");
    setPin("");
  };

  const handleSendMoney = async () => {
    if (
      !receiverPhone ||
      !amount ||
      Number(amount) <= 0 ||
      !pin ||
      pin.length !== 4
    ) {
      toast.error("Enter valid details including 4-digit PIN");
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
          pin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send money");
        return;
      }

      toast.success("Money sent successfully");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[#002970] font-semibold mb-6"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-[#002970] text-center">
          Send Money
        </h2>

        {/* MODE SELECT */}
        {!mode && (
          <div className="space-y-4">
            <button
              onClick={() => handleModeChange("phone")}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gradient-to-r from-[#00B9F1] to-[#0077B6] text-white font-bold"
            >
              <Send size={18} />
              Pay via Phone Number
            </button>

            <button
              onClick={() => handleModeChange("qr")}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-gray-100 font-bold text-[#002970]"
            >
              <QrCode size={18} />
              Scan QR
            </button>
          </div>
        )}

        {/* PHONE MODE */}
        {mode === "phone" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 text-center">
              Send via Phone Number
            </h3>

            <input
              type="text"
              placeholder="Receiver phone number"
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

            <input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
              className="w-full px-4 py-3 rounded-xl border text-sm"
            />

            <button
              onClick={handleSendMoney}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#002970] text-white font-bold"
            >
              {loading ? "Sending..." : "Confirm Payment"}
            </button>
          </div>
        )}

        {/* QR MODE */}
        {mode === "qr" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 text-center">
              Scan QR Code
            </h3>

            <div className="flex justify-center">
              <div className="h-40 w-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm">
                QR Scanner Placeholder
              </div>
            </div>

            <p className="text-xs text-center text-gray-400">
              (Simulated QR — enter phone manually)
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

            <input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={4}
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
        )}
      </div>
    </div>
  );
}
