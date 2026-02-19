"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";

export default function SecurityPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch user and PIN status
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, pinRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/wallet/pin-status"),
        ]);

        if (!userRes.ok) throw new Error();
        const userData = await userRes.json();
        setUser(userData.user);

        if (pinRes.ok) {
          const pinData = await pinRes.json();
          setHasPin(pinData.hasPin ?? false);
        } else {
          setHasPin(false);
        }
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSetPin = async () => {
    if (!newPin || !confirmPin) {
      toast.error("All fields are required");
      return;
    }

    if (newPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch("/api/wallet/update-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPin }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to set PIN");
        return;
      }

      toast.success("Transaction PIN set successfully");
      setHasPin(true);
      setNewPin("");
      setConfirmPin("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePin = async () => {
    if (!oldPin || !newPin || !confirmPin) {
      toast.error("All fields are required");
      return;
    }

    if (newPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    if (newPin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch("/api/wallet/update-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPin,
          newPin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update PIN");
        return;
      }

      toast.success("Transaction PIN updated successfully");

      setOldPin("");
      setNewPin("");
      setConfirmPin("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      {/* Back Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-[#002970] font-semibold mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Security Info Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-[#002970]" />
            <h2 className="text-2xl font-bold text-[#002970]">
              Account Security
            </h2>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Phone Number</span>
              <span className="font-semibold text-[#002970]">
                {user?.phone_number}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Account Created</span>
              <span className="font-semibold text-[#002970]">
                {new Date(user?.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Verification Status</span>
              <span className="font-semibold text-green-600">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Set PIN / Change PIN Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="text-[#002970]" />
            <h3 className="text-xl font-bold text-[#002970]">
              {hasPin ? "Change Transaction PIN" : "Set Transaction PIN"}
            </h3>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            {hasPin
              ? "Enter your current PIN and choose a new 4-digit PIN."
              : "Create a 4-digit PIN to secure your transactions."}
          </p>

          <div className="space-y-4">
            {hasPin && (
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter current PIN"
                value={oldPin}
                onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
                className="w-full px-4 py-3 rounded-xl border text-sm"
              />
            )}

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder={hasPin ? "Enter new PIN (4 digits)" : "Enter PIN (4 digits)"}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 rounded-xl border text-sm"
            />

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Confirm PIN"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 rounded-xl border text-sm"
            />

            <button
              onClick={hasPin ? handleUpdatePin : handleSetPin}
              disabled={updating}
              className="w-full py-3 rounded-xl bg-[#002970] text-white font-bold"
            >
              {updating ? (hasPin ? "Updating..." : "Setting...") : hasPin ? "Update PIN" : "Set PIN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
