"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Phone,
  Wallet,
  Calendar,
  Landmark,
} from "lucide-react";

const BANKS = [
  "HDFC Bank",
  "State Bank of India",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "Indian Bank",
  "Federal Bank",
  "Yes Bank",
  "IndusInd Bank",
  "IDFC First Bank",
  "Other",
];

function maskAccount(num: string) {
  if (!num || num.length < 4) return "****";
  return "****" + num.slice(-4);
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [updating, setUpdating] = useState(false);

  const [showBankForm, setShowBankForm] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [linkingBank, setLinkingBank] = useState(false);

  const hasBank =
    user?.bank_name && user?.bank_account_number && user?.bank_account_holder;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok) {
          router.push("/login");
          return;
        }

        setUser(data.user);
        setName(data.user.name || "");
        setEmail(data.user.email || "");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }

    try {
      setUpdating(true);

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Update failed");
        return;
      }

      toast.success("Profile updated successfully");

      setUser({
        ...user,
        name,
        email,
      });
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleLinkBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountHolderName || !accountNumber || !ifsc) {
      toast.error("All bank fields are required");
      return;
    }
    if (accountNumber.length < 9 || accountNumber.length > 18) {
      toast.error("Account number must be 9-18 digits");
      return;
    }
    if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc)) {
      toast.error("Invalid IFSC code");
      return;
    }

    try {
      setLinkingBank(true);
      const res = await fetch("/api/profile/link-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bankName,
          accountHolderName,
          accountNumber: accountNumber.replace(/\D/g, ""),
          ifsc: ifsc.toUpperCase(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to link bank");
        return;
      }

      toast.success("Bank linked successfully");
      setUser({
        ...user,
        bank_name: bankName,
        bank_account_number: accountNumber.replace(/\D/g, ""),
        bank_ifsc: ifsc.toUpperCase(),
        bank_account_holder: accountHolderName,
      });
      setShowBankForm(false);
      setBankName("");
      setAccountHolderName("");
      setAccountNumber("");
      setIfsc("");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLinkingBank(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] p-6">
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-[#002970] font-semibold mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-[#002970] text-center">
          My Profile
        </h2>

        {/* Avatar */}
<div className="flex flex-col items-center gap-4">
  <div className="relative">
    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-[#00B9F1]">
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
          alt="Avatar"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-[#00B9F1] to-[#0077B6] flex items-center justify-center text-white text-3xl font-bold">
          {name?.[0] || "U"}
        </div>
      )}
    </div>
  </div>

  <input
    type="file"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/upload-avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Avatar updated");
        setUser({ ...user, avatar_url: data.avatarUrl });
      } else {
        toast.error(data.error || "Upload failed");
      }
    }}
    className="text-sm"
/>
</div>


        {/* Editable Fields */}
        <div className="space-y-4">

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border text-sm"
            />
          </div>

          <button
            onClick={handleUpdateProfile}
            disabled={updating}
            className="w-full py-3 rounded-xl bg-[#002970] text-white font-bold"
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mt-6">
          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <Phone size={18} />
            <span>{user.phone_number}</span>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <Wallet size={18} />
            <span>
              Balance: ₹{Number(user.balance).toLocaleString("en-IN")}
            </span>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
            <Calendar size={18} />
            <span>
              Member since{" "}
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Bank Section */}
          <div className="bg-gray-50 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Landmark size={18} className="text-[#002970]" />
                <span className="font-semibold text-[#002970]">Linked Bank</span>
              </div>
              <button
                onClick={() => {
                  setShowBankForm(!showBankForm);
                  if (!showBankForm && hasBank) {
                    setBankName(user.bank_name || "");
                    setAccountHolderName(user.bank_account_holder || "");
                    setAccountNumber("");
                    setIfsc(user.bank_ifsc || "");
                  }
                }}
                className="text-sm font-semibold text-[#00B9F1] hover:text-[#0077B6]"
              >
                {hasBank ? "Change Bank" : "Link Bank"}
              </button>
            </div>

            {hasBank && !showBankForm && (
              <div className="text-sm text-gray-600 space-y-1 pt-2 border-t border-gray-200">
                <p><span className="font-medium">Bank:</span> {user.bank_name}</p>
                <p><span className="font-medium">Account:</span> {maskAccount(user.bank_account_number)}</p>
                <p><span className="font-medium">IFSC:</span> {user.bank_ifsc}</p>
                <p><span className="font-medium">Name:</span> {user.bank_account_holder}</p>
              </div>
            )}

            {showBankForm && (
              <form onSubmit={handleLinkBank} className="space-y-3 pt-2 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Bank</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    required
                  >
                    <option value="">Choose bank</option>
                    {BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    placeholder="As per bank record"
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="9-18 digits"
                    maxLength={18}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="e.g. HDFC0001234"
                    maxLength={11}
                    className="w-full px-4 py-2 rounded-xl border text-sm"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={linkingBank}
                    className="flex-1 py-2 rounded-xl bg-[#002970] text-white font-bold text-sm disabled:opacity-50"
                  >
                    {linkingBank ? "Saving..." : "Save Bank Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBankForm(false);
                      setBankName("");
                      setAccountHolderName("");
                      setAccountNumber("");
                      setIfsc("");
                    }}
                    className="px-4 py-2 rounded-xl border text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
