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
  const { mutateAsync: login } = useLogin();
  const [user, setUser] = useState<AuthUser | null>(() => {
    const data = getAuthData();
    return data;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) setIsLoading(false);
      if (user && user.display_name) {
        try {
          const res = await login({
            fullName: user.display_name,
          });
          const { lucky, ...rest } = res;
          const updatedUser = {
            ...user,
            access_token: rest.access_token,
            currentUser: rest.currentUser,
          };
          setUser(updatedUser);
          setAuthData(updatedUser);
        } catch (error) {
          // Handle error silently or show message
          console.error("Failed to refresh user data:", error);
        }
        setIsLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
