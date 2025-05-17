import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { generateId } from '../utils/helpers';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin' as const,
  },
  {
    id: 'staff-1',
    name: 'Staff Roads',
    email: 'roads@example.com',
    role: 'staff' as const,
    department: 'roads' as const,
  },
  {
    id: 'staff-2',
    name: 'Staff Sanitation',
    email: 'sanitation@example.com',
    role: 'staff' as const,
    department: 'sanitation' as const,
  },
  {
    id: 'citizen-1',
    name: 'John Citizen',
    email: 'john@example.com',
    role: 'citizen' as const,
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return Promise.resolve();
    } else {
      // Create a new citizen user
      const newUser: User = {
        id: generateId(),
        name: email.split('@')[0], // Simple name from email
        email,
        role: 'citizen'
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return Promise.resolve();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'staff'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};