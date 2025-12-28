// Authentication utilities for admin dashboard

const TOKEN_KEY = 'admin_token';

export const auth = {
    // Store JWT token in localStorage
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Retrieve JWT token from localStorage
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Remove JWT token from localStorage
    removeToken(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
        }
    },

    // Check if user is authenticated
    isAuthenticated(): boolean {
        console.log(!!this.getToken())
        return !!this.getToken();
    },

    // Logout and redirect to admin login
    logout(): void {
        this.removeToken();
        if (typeof window !== 'undefined') {
            window.location.href = '/admin';
        }
    },
};
