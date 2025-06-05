"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }) {
  const { user, token } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for auth context to be ready
    const check = () => {
      if (!token || !user) {
        router.replace("/login");
      }
      setCheckingAuth(false);
    };

    // Small delay to allow context to hydrate
    const timeout = setTimeout(check, 100); // or 200ms

    return () => clearTimeout(timeout);
  }, [token, user]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Checking Authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <main className="p-6">{children}</main>
    </div>
  );
}
