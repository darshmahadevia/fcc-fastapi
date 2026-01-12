import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/lib/api';
import type { LoginCredentials, UserCreate } from '@/types';

interface JWTPayload {
  user_id: string | number; // Backend sends as string, but keep type flexible
  exp: number;
}

interface AuthContextType {
  user: { id: number } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: UserCreate) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          // Ensure user_id is a number (backend sends it as string)
          setUser({ id: Number(decoded.user_id) });
        } else {
          localStorage.removeItem('access_token');
        }
      } catch {
        localStorage.removeItem('access_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const tokenData = await authApi.login(credentials);
    localStorage.setItem('access_token', tokenData.access_token);
    const decoded = jwtDecode<JWTPayload>(tokenData.access_token);
    // Ensure user_id is a number (backend sends it as string)
    setUser({ id: Number(decoded.user_id) });
  };

  const register = async (userData: UserCreate) => {
    await authApi.register(userData);
    // Auto-login after registration
    await login({ username: userData.email, password: userData.password });
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
