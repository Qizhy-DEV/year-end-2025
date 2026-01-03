
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/query-client";
import { Toaster } from "react-hot-toast";
import Layout from "@/components/layout";
import { AuthAdminProvider, useAuthAdmin } from "@/context/auth-admin-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gray-50">
                <AuthAdminProvider>
                    <Content>{children}</Content>
                </AuthAdminProvider>
                <Toaster position="top-right" />
            </div>
        </QueryClientProvider>
    );
}

function Content({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuthAdmin();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!user && pathname !== "/admin") {
                router.push("/admin");
            } else if (user && pathname === "/admin") {
                router.push("/admin/participants");
            }
        }
    }, [user, isLoading, pathname, router]);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user && pathname === "/admin") {
        return children;
    }

    if (!user) {
        return null; // Don't render protected content while redirecting
    }

    return (
        <Layout>{children}</Layout>
    );
}
