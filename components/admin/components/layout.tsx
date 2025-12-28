"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../../libs/auth";
import { Users, Gift, QrCode, LogOut, Settings, Menu, List } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/libs/utils";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const handleLogout = () => {
        auth.logout();
        router.push("/admin");
    };

    const navItems = [
        { href: "/admin/participants", label: "Người Tham Dự", icon: Users },
        { href: "/admin/qr-scanner", label: "Quét QR", icon: QrCode },
        { href: "/admin/prizes", label: "Giải Thưởng", icon: Gift },
    ];

    const getPageTitle = () => {
        const currentItem = navItems.find(item => item.href === pathname);
        return currentItem?.label || "Dashboard";
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <div
                className={cn(
                    "relative flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
                    sidebarExpanded ? "w-64" : "w-16"
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-center h-16 border-b border-gray-200">
                    <div className={cn(
                        "flex items-center gap-2 transition-all duration-300",
                        sidebarExpanded ? "px-4" : "px-0"
                    )}>
                        <div className="w-8 h-8 bg-gradient-to-br from-[#3432c7] to-[#5856d6] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            YE
                        </div>
                        {sidebarExpanded && (
                            <span className="font-semibold text-gray-900 whitespace-nowrap">Year End</span>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 py-4">
                    <div className="space-y-1 px-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-orange-500 text-white shadow-md"
                                            : "text-gray-700 hover:bg-gray-100",
                                        !sidebarExpanded && "justify-center"
                                    )}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {sidebarExpanded && (
                                        <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Bottom Section */}
                <div className="border-t border-gray-200">
                    <div className="space-y-1 px-2 py-4">
                        {/* Settings */}
                        <button
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200",
                                !sidebarExpanded && "justify-center"
                            )}
                        >
                            <Settings className="w-5 h-5 flex-shrink-0" />
                            {sidebarExpanded && (
                                <span className="text-sm font-medium whitespace-nowrap">Cài Đặt</span>
                            )}
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200",
                                !sidebarExpanded && "justify-center"
                            )}
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {sidebarExpanded && (
                                <span className="text-sm font-medium whitespace-nowrap">Đăng Xuất</span>
                            )}
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className={cn(
                        "px-2 py-3 border-t border-gray-200",
                        !sidebarExpanded && "flex justify-center"
                    )}>
                        <div className={cn(
                            "flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200",
                            !sidebarExpanded && "justify-center"
                        )}>
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                A
                            </div>
                            {sidebarExpanded && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
                                    <p className="text-xs text-gray-500 truncate">admin@yearend.com</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        {/* Toggle Sidebar Button */}
                        <button
                            onClick={() => setSidebarExpanded(!sidebarExpanded)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title={sidebarExpanded ? "Thu gọn sidebar" : "Mở rộng sidebar"}
                        >
                            {sidebarExpanded ? (
                                <List className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>

                        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="hidden md:block">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3432c7] focus:border-transparent"
                            />
                        </div>

                        {/* User Controls */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
