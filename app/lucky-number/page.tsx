"use client";
import Main from "@/components/main";
import { AuthProvider } from "@/context/auth-context";
import { queryClient } from "@/core/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

const LuckyNumberPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default LuckyNumberPage;
