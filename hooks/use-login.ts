import { useMutation } from "@tanstack/react-query";
import { login } from "@/api";

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ fullName }: { fullName: string }) => login(fullName),
  });
};
