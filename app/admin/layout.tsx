
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/query-client";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-gray-50">
                {children}
                <Toaster position="top-right" />
            </div>
        </QueryClientProvider>
    );
}
