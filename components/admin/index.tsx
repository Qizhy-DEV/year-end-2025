"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../libs/auth";
import { api } from "../../libs/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        if (auth.isAuthenticated()) {
            router.push("/admin/participants");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setLoading(true);

        try {
            const response = await api.login(username, password);
            auth.setToken(response.access_token);
            toast.success("Đăng nhập thành công!");
            setTimeout(() => {
                router.push("/admin/participants");
            }, 500);
        } catch (error: any) {
            console.error("Login error:", error);
            if (error.response?.status === 401) {
                toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
            } else {
                toast.error("Đã xảy ra lỗi. Vui lòng thử lại");
            }
        } finally {
            setLoading(false);
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
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-white/80 text-sm">
                            Đăng nhập để quản lý hệ thống
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="block text-white font-medium text-sm"
                            >
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setUsername(e.target.value)
                                }
                                placeholder="admin"
                                className="bg-white/20 px-4 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 rounded-xl h-12 text-base w-full transition-all outline-none hover:border-white/50 focus:ring-2 focus:ring-[#FFD700]/35"
                                autoComplete="username"
                                disabled={loading}
                            />
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
                                placeholder="••••••••"
                                className="bg-white/20 px-4 border border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 focus:border-white/50 rounded-xl h-12 text-base w-full transition-all outline-none hover:border-white/50 focus:ring-2 focus:ring-[#FFD700]/35"
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#e2c086] text-[#8B0000] font-bold text-lg h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700]/80 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
