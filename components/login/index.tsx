"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useLogin } from "@/hooks/use-login";
import { useAuth } from "@/context/auth-context";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { loginUser } = useAuth();

  const { mutateAsync: login } = useLogin();

  // Validate username must end with ".hd"
  const validateUsername = (uname: string) => {
    if (!uname.trim()) {
      setError("Vui lòng nhập username");
      return false;
    }
    if (!uname.trim().endsWith(".hd")) {
      setError("Username phải kết thúc bằng .hd");
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
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validUsername = validateUsername(username);
    const validPassword = validatePassword(password);

    if (validUsername && validPassword) {
      const res = await login({ username, password });
      loginUser({ ...res, password });
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
              Nhập username để nhận lì xì may mắn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-white font-medium text-sm"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
                placeholder="Ví dụ: nguyenvana.hd"
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
                  📝 Username phải kết thúc bằng <b>.hd</b>
                </span>
                <span className="block">
                  🚫 Không được nhập username của người khác
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
