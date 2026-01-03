// TypeScript interfaces for the year-end party system

export interface User {
    _id: string;
    lucky_number: number;
    full_name: string;
    role: 'guest' | 'employee';
    is_checked_in: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface Prize {
    _id: string;
    name: string;
    lucky_number: number | null;
    is_revealed: boolean;
    winner?: User;
    createdAt?: string;
    updatedAt?: string;
}

export interface LoginResponse {
    access_token: string;
    admin: {
        id: string;
        username: string;
        full_name: string;
    };
}

export interface CreateUserDto {
    full_name: string;
    lucky_number: number;
    role?: 'guest' | 'employee';
}

export interface CreatePrizeDto {
    name: string;
    lucky_number?: number;
}

export interface UpdatePrizeLuckyNumberDto {
    lucky_number: number;
}

export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
}

export interface Pagination<T> {
    items: T[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_items: number;
        items_per_page: number;
    };
}
