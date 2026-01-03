import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './auth';
import type { User, Prize, LoginResponse, CreateUserDto, CreatePrizeDto } from './types';

// Base API URL - update this to match your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
    const token = auth.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors (unauthorized)
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            auth.logout();
        }
        return Promise.reject(error);
    }
);

// API methods
export const api = {
    // Authentication
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', {
            username,
            password,
        });
        return response.data;
    },

    // Users / Participants
    async getUsersStats(): Promise<{ total: number; checkedInCount: number }> {
        const response = await apiClient.get('/users/stats');
        return response.data;
    },

    async getUsers(
        page: number = 1,
        limit: number = 10,
        search?: string,
        isCheckedIn?: boolean,
        sort?: string
    ): Promise<{ users: User[]; total: number; checkedInCount: number; page: number; totalPages: number }> {
        let url = `/users?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (isCheckedIn !== undefined) url += `&isCheckedIn=${isCheckedIn}`;
        if (sort) url += `&sort=${sort}`;

        const response = await apiClient.get(url);
        return response.data;
    },

    async createUser(data: CreateUserDto): Promise<User> {
        const response = await apiClient.post<User>('/users', data);
        return response.data;
    },

    async importUsersCSV(file: File): Promise<{ message: string; count: number; users: User[] }> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await apiClient.post('/users/import-csv', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async checkInUser(userId: string): Promise<{ message: string; user: User }> {
        const response = await apiClient.post(`/users/${userId}/check-in`);
        return response.data;
    },

    async lookupUserByName(name: string): Promise<{ count: number; users: User[] }> {
        const response = await apiClient.get(`/users/lookup?name=${encodeURIComponent(name)}`);
        return response.data;
    },

    async getUserById(userId: string): Promise<User> {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },

    // Prizes
    async getPrizes(page: number = 1, limit: number = 10): Promise<{ prizes: Prize[]; total: number; page: number; totalPages: number }> {
        const response = await apiClient.get(`/prizes?page=${page}&limit=${limit}`);
        return response.data;
    },

    async createPrize(data: CreatePrizeDto): Promise<Prize> {
        const response = await apiClient.post<Prize>('/prizes', data);
        return response.data;
    },

    async revealPrize(prizeId: string): Promise<{ message: string; prize: Prize }> {
        const response = await apiClient.post(`/prizes/${prizeId}/reveal`);
        return response.data;
    },

    async getWinners(): Promise<Prize[]> {
        const response = await apiClient.get<Prize[]>('/prizes/winners');
        return response.data;
    },
};

export default api;
