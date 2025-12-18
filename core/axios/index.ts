import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let refreshTokenPromise: null | Promise<void> = null;

// Response interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (err) => Promise.reject(err)
);

export default axiosClient;
