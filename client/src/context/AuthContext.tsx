import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: 'admin' | 'staff';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin data
const MOCK_ADMINS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    department: 'Administration',
    role: 'admin' as const,
  },
  {
    id: '2',
    name: 'Water Department',
    email: 'water@example.com',
    password: 'water123',
    department: 'Water',
    role: 'staff' as const,
  },
  {
    id: '3',
    name: 'Roads Department',
    email: 'roads@example.com',
    password: 'roads123',
    department: 'Roads',
    role: 'staff' as const,
  },
];

const AUTH_STORAGE_KEY = 'civicvoice_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      const parsedAuth = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUser(parsedAuth.user);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundAdmin = MOCK_ADMINS.find(
      (admin) => admin.email === email && admin.password === password
    );

    if (foundAdmin) {
      const { password, ...userWithoutPassword } = foundAdmin;
      setIsAuthenticated(true);
      setUser(userWithoutPassword);
      
      // Save to localStorage
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ isAuthenticated: true, user: userWithoutPassword })
      );
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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