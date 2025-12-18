import axiosClient from "@/core/axios";
import { API_PATHS } from "./path";

type LoginResponse = {
  token: string;
};

type LuckyNumberResponse = {
  luckyNumber: number;
};

export const login = async (): Promise<LoginResponse> => {
  return (await axiosClient.get<LoginResponse>(API_PATHS.login)).data;
};

export const getLuckyNumber = async (
  username: string,
  password: string
): Promise<LuckyNumberResponse> => {
  const response = await axiosClient.get<LuckyNumberResponse>(
    API_PATHS.getLuckyNumber,
    {
      params: {
        username,
        password,
      },
    }
  );

  return response.data;
};
