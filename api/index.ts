import axiosClient from "@/core/axios";
import { API_PATHS } from "./path";

export type LoginResponse = {
  success: boolean;
  access_token: string;
  ID: string;
  user_login: string;
  display_name: string;
  lucky: number;
  currentUser: {
    _id: string;
    full_name: string;
    lucky_number: number;
    is_checked_in: boolean;
    role: string;
  };
};

type LuckyNumberResponse = {
  lucky: number;
};

export const login = async (
  fullName: string
): Promise<LoginResponse> => {
  return (
    await axiosClient.post<LoginResponse>(API_PATHS.login, {
      full_name: fullName,
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
