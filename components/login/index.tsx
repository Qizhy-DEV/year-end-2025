"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useLogin } from "@/hooks/use-login";
import { useAuth } from "@/context/auth-context";

export default function Login() {
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();

  const { mutateAsync: login, isPending } = useLogin();

  // Set black background for body and main when on this page
  useEffect(() => {
    document.body.style.backgroundColor = "black";
    const mainElement = document.querySelector("main");
    if (mainElement) {
      (mainElement as HTMLElement).style.backgroundColor = "black";
    }

    // Cleanup: restore original background when component unmounts
    return () => {
      document.body.style.backgroundColor = "";
      const mainElement = document.querySelector("main");
      if (mainElement) {
        (mainElement as HTMLElement).style.backgroundColor = "";
      }
    };
  }, []);

  // Validate fullName
  const validateFullName = (name: string) => {
    if (!name.trim()) {
      setError("Vui lòng nhập họ và tên");
      return false;
    }
    if (name.trim().length < 2) {
      setError("Họ và tên phải có ít nhất 2 ký tự");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validFullName = validateFullName(fullName);

    if (validFullName) {
      try {
        const res = await login({ fullName: fullName.trim() });
        loginUser({
          ID: res.ID,
          user_login: res.user_login,
          display_name: res.display_name,
          lucky: res.lucky,
          access_token: res.access_token,
          currentUser: res.currentUser,
        });
      } catch (error: any) {
        setError(
          error?.response?.data?.message ||
            "Đăng nhập thất bại. Vui lòng thử lại."
        );
      }
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
              Nhập họ và tên để nhận lì xì may mắn
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
                placeholder="Ví dụ: Nguyễn Văn A"
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#e2c086] text-[#8B0000] font-bold text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700]/80 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-[#8B0000]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                "Xác Nhận"
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/60 text-xs leading-relaxed space-y-1">
                <span className="block">📝 Nhập đúng họ và tên của bạn</span>
                <span className="block">
                  🚫 Không được nhập tên của người khác
                </span>
                <span className="block">
                  ✨ Hệ thống sẽ tự động xác nhận danh tính
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
