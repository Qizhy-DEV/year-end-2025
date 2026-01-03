import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { setAuthData, removeAuthData } from "@/libs/token";
import { useLogin } from "@/hooks/use-login";

type AuthUser = {
  ID: string;
  user_login: string;
  display_name: string;
  lucky: number;
  access_token?: string;
  currentUser?: {
    _id: string;
    full_name: string;
    lucky_number: number;
    is_checked_in: boolean;
    role: string;
  };
  avatar?: string;
  email?: string;
  admin?: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  loginUser: (userData: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  useLogin();
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Không khởi tạo từ localStorage vì chỉ có token
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Không cần fetch user từ localStorage vì chỉ lưu token
    setIsLoading(false);
  }, []);

  const loginUser = (userData: AuthUser) => {
    setUser(userData);
    // Chỉ lưu access_token vào localStorage
    if (userData.access_token) {
      setAuthData({ access_token: userData.access_token });
    }
  };

  const logout = () => {
    setUser(null);
    removeAuthData();
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
