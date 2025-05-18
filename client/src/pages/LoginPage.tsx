import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LogIn } from 'lucide-react';

interface LocationState {
  from?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // not used for the MVP, but included for UX
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Prefill demo accounts for easy testing
  const demoAccounts = [
    { label: 'Admin', email: 'admin@example.com' },
    { label: 'Staff (Roads)', email: 'roads@example.com' },
    { label: 'Staff (Sanitation)', email: 'sanitation@example.com' },
    { label: 'Citizen', email: 'john@example.com' }
  ];
  
  // After login, redirect to the page they were trying to access
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as LocationState;
      navigate(state?.from || '/');
    }
  }, [isAuthenticated, navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      // Redirect happens in the useEffect above
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or try a demo account to explore the system
          </p>
        </div>
        
        {/* Demo Accounts */}
        <div className="grid grid-cols-2 gap-2">
          {demoAccounts.map(account => (
            <Button
              key={account.email}
              variant="outline"
              size="sm"
              onClick={() => setEmail(account.email)}
              className="text-xs justify-center"
            >
              {account.label}
            </Button>
          ))}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="email"
              name='email'
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={error}
            />
            
            <Input
              id="password"
              name='password'
              label="Password (any value works for demo)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              icon={<LogIn size={16} />}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
          
          <div className="text-center text-sm">
            <p className="text-gray-600">
              For the MVP demo, you can use any email address.
              <br />
              New users will be created automatically.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;