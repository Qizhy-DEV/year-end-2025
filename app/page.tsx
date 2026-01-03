"use client";

import { Suspense } from "react";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { queryClient } from "@/core/query-client";
import ComingSoon from "@/components/coming-soon";
import Login from "@/components/login";
import ResultPage from "@/components/result";
import { QueryClientProvider } from "@tanstack/react-query";

const EVENT_DATE = new Date("2025-12-17T15:30:00");

const Content = () => {
  const shouldShowComingSoon = new Date() < EVENT_DATE;
  const { user, isLoading } = useAuth();

  if (shouldShowComingSoon) {
    return <ComingSoon />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <ResultPage />;
};

function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center">
              Đang tải...
            </div>
          }
        >
          <Content />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Page;
