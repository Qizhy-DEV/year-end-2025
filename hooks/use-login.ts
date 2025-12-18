import { useMutation } from "@tanstack/react-query";
import { login } from "@/api";
import { setAuthToken } from "@/libs/token";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token);
      }
    },
  });
};
