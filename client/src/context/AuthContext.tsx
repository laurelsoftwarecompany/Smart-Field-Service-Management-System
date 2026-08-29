import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Interfaces for Auth
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Manager' | 'Technician' | 'Admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Make sure this matches backend URL
          const response = await axios.get('http://localhost:5000/api/auth/me');
          setState({
            user: response.data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
