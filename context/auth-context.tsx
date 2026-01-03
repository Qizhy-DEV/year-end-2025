import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { getAuthData, setAuthData, removeAuthData } from "@/libs/token";
import { useLogin } from "@/hooks/use-login";

type AuthUser = {
  ID: number;
  user_login: string;
  display_name: string;
  password: string;
  lucky: number;
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
  const { mutateAsync: login } = useLogin();
  const [user, setUser] = useState<AuthUser | null>(() => {
    const data = getAuthData();
    return data;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        setIsLoading(true);
        const res = await login({
          username: user.user_login,
          password: user.password,
        });
        if (res.lucky) {
          setAuthData({ ...user, lucky: res.lucky });
        }
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const loginUser = (userData: AuthUser) => {
    setUser(userData);
    setAuthData(userData);
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
