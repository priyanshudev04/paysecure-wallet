"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Phone,
  Wallet,
  Calendar,
  Mail,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [updating, setUpdating] = useState(false);

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
        </div>
      </div>
    </div>
  );
}
