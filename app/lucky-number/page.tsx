"use client";
import { Suspense } from "react";
import Main from "@/components/main";
import { AuthProvider } from "@/context/auth-context";
import { queryClient } from "@/core/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

const LuckyNumberPageContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </QueryClientProvider>
  );
};

const LuckyNumberPage = () => {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Đang tải...</div>}>
      <LuckyNumberPageContent />
    </Suspense>
  );
};

export default LuckyNumberPage;
