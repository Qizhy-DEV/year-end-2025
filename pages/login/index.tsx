"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { signToken } from "@/libs/token";

export default function Login() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateVietnameseName = (name: string) => {
    // Check if name is empty
    if (!name.trim()) {
      setError("Vui lòng nhập họ và tên");
      return false;
    }

    // Check if first letter of each word is capitalized
    const words = name.trim().split(/\s+/);
    for (const word of words) {
      if (word[0] !== word[0].toUpperCase()) {
        setError("Phải viết hoa chữ cái đầu mỗi từ");
        return false;
      }
    }

    // Check if name has at least 2 words (họ và tên)
    if (words.length < 2) {
      setError("Vui lòng nhập đầy đủ họ và tên");
      return false;
    }

    setError("");
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError("Vui lòng nhập mật khẩu");
      return false;
    }
    // You can add additional password rules here if needed
    setPasswordError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validName = validateVietnameseName(fullName);
    const validPassword = validatePassword(password);

    if (validName && validPassword) {
      localStorage.setItem("info", fullName);
      localStorage.setItem("password", password);
      console.log(signToken({ fullName, password }));
      // router.push("/");
    }
  };

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-black via-[#3432c7] via-40% via-[#3432c7]/100 to-black flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute -bottom-18 -left-1/3 h-16 z-50 w-3/2"
        style={{
          boxShadow: "0 -40px 40px rgba(0,0,0,1)",
        }}
      />
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <div className="w-full flex justify-center items-center mb-4">
              <Image
                src="/hdwebsoft.png"
                alt="HDWebsoft Logo"
                width={150}
                height={0}
                priority
              />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 text-balance">
              Chào Mừng <br /> Xuân Bính Ngọ 2026
            </h1>
            <p className="text-white/80 text-sm">
              Nhập tên để nhận lì xì may mắn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="block text-white font-medium text-sm"
              >
                Họ và Tên
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFullName(e.target.value)
                }
                placeholder="Ví dụ: Nguyễn Văn An"
                className="bg-white/20 px-4 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 rounded-xl h-12 text-base w-full transition-all outline-none hover:border-white/50 focus:ring-2 focus:ring-[#FFD700]/35"
                autoComplete="off"
                spellCheck={true}
              />
              {error && (
                <p className="text-red-300 text-sm flex items-center gap-1">
                  <span>⚠️</span>
                  {error}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-white font-medium text-sm"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Nhập mật khẩu"
                className="bg-white/20 px-4 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 rounded-xl h-12 text-base w-full transition-all outline-none hover:border-white/50 focus:ring-2 focus:ring-[#FFD700]/35"
                autoComplete="off"
                spellCheck={false}
              />
              {passwordError && (
                <p className="text-red-300 text-sm flex items-center gap-1">
                  <span>⚠️</span>
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#e2c086] text-[#8B0000] font-bold text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700]/80 active:scale-95"
            >
              Xác Nhận
            </button>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/60 text-xs leading-relaxed space-y-1">
                <span className="block">
                  📝 Phải nhập có dấu, viết hoa chữ đầu
                </span>
                <span className="block">
                  🚫 Không được nhập tên của người khác
                </span>
                <span className="block">🔒 Mật khẩu từ 1 ký tự trở lên</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
