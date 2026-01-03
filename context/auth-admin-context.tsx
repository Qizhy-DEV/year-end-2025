import { api } from "@/libs/api";
import { auth } from "@/libs/auth";
import { LoginResponse } from "@/libs/types";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type AdminUser = {
    id: string;
    username: string;
    full_name: string;
};

type AuthAdminContextType = {
    user: AdminUser | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthAdminContext = createContext<AuthAdminContextType | undefined>(
    undefined
);

export const AuthAdminProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = auth.getToken();
            if (token) {
                const adminInfo = localStorage.getItem('admin_info');
                if (adminInfo) {
                    setUser(JSON.parse(adminInfo));
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const response: LoginResponse = await api.login(username, password);
            auth.setToken(response.access_token);

            // Store admin info for persistence since we don't have a /me endpoint confirmed
            if (response.admin) {
                const adminUser = {
                    id: response.admin.id,
                    username: response.admin.username,
                    full_name: response.admin.full_name
                };
                setUser(adminUser);
                localStorage.setItem('admin_info', JSON.stringify(adminUser));
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        auth.logout();
        setUser(null);
        localStorage.removeItem('admin_info');
    };

    return (
        <AuthAdminContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthAdminContext.Provider>
    );
};

export const useAuthAdmin = (): AuthAdminContextType => {
    const context = useContext(AuthAdminContext);
    if (context === undefined) {
        throw new Error("useAuthAdmin must be used within an AuthAdminProvider");
    }
    return context;
};
