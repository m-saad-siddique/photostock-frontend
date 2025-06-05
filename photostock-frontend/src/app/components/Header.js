"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header({ onSearch }) {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 border-b shadow-sm bg-white sticky top-0 z-10">
      <div className="text-2xl font-extrabold tracking-tight text-pink-600 cursor-pointer" onClick={() => router.push("/")}>
        📸 PhotoStock
      </div>

      <nav className="hidden md:flex gap-6 text-sm font-medium">
        <a href="#" className="hover:text-pink-600">License</a>
        <a href="#" className="hover:text-pink-600">About</a>
        <a href="#" className="hover:text-pink-600">Browse</a>
      </nav>

      {/* <input
        type="text"
        placeholder="Search free photos..."
        className="border rounded-full px-4 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={search}
        onChange={handleSearch}
      /> */}

      {/* 🔐 Auth Buttons */}
      <div className="ml-4 flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-700 hidden sm:inline">👤 {user.email}</span>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-pink-600 text-white text-sm px-3 py-1 rounded hover:bg-pink-700 transition"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="text-sm border border-pink-600 text-pink-600 px-3 py-1 rounded hover:bg-pink-50 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="text-sm border border-pink-600 text-pink-600 px-3 py-1 rounded hover:bg-pink-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="bg-pink-600 text-white text-sm px-3 py-1 rounded hover:bg-pink-700 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
