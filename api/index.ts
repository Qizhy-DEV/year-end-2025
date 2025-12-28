import axiosClient from "@/core/axios";
import { API_PATHS } from "./path";

export type LoginResponse = {
  success: boolean;
  ID: number;
  user_login: string;
  display_name: string;
  lucky: number;
};

type LuckyNumberResponse = {
  lucky: number;
};

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  return (
    await axiosClient.get<LoginResponse>(API_PATHS.login, {
      params: {
        user_name: username,
        password,
      },
    })
  ).data;
};

export const getLuckyNumber = async (
  username: string,
  password: string
): Promise<LuckyNumberResponse> => {
  const response = await axiosClient.get<LuckyNumberResponse>(
    API_PATHS.getLuckyNumber,
    {
      params: {
        user_name: username,
        password,
      },
    }
  );

  return response.data;
};
