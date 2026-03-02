import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { usersService } from '../services';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  vehicles: string[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addVehicle: (vehicleId: string) => void;
  removeVehicle: (vehicleId: string) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersService.login({ email, password });
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setVehicles([]);
    localStorage.removeItem('authToken');
  };

  const addVehicle = (vehicleId: string) => {
    setVehicles(prev => [...prev, vehicleId]);
  };

  const removeVehicle = (vehicleId: string) => {
    setVehicles(prev => prev.filter(v => v !== vehicleId));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        vehicles,
        login,
        logout,
        addVehicle,
        removeVehicle,
        loading,
        error,
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
