import { useMutation } from "@tanstack/react-query";
import { getLuckyNumber } from "@/api";

type UseLuckyNumberProps = {
  username: string;
  password: string;
};

export const useLuckyNumber = () => {
  return useMutation({
    mutationKey: ["luckyNumber"],
    mutationFn: ({ username, password }: UseLuckyNumberProps) =>
      getLuckyNumber(username, password),
  });
};
