import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Wrench } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Hardcoded login bypass for UI testing
      if (email === 'admin@admin.com' && password === 'admin123') {
        login('dummy-token', {
          id: '1',
          name: 'Admin User',
          email: 'admin@admin.com',
          role: 'Admin'
        });
        navigate('/');
        return;
      }

      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;
      
      // Ensure only Managers and Admins can log into this dashboard
      if (user.role !== 'Manager' && user.role !== 'Admin') {
        setError('Unauthorized: Dashboard access is restricted to Managers and Admins.');
        setIsLoading(false);
        return;
      }

      login(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-3 text-center pb-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Smart Field Service</CardTitle>
          <CardDescription>Enter your credentials to access the dashboard</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md border border-destructive/20 text-center font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m.scott@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
          </CardContent>
          <CardFooter className="pt-4">
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
