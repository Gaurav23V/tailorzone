'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: LoginFormData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const { user, tokens } = await response.json();
      login(tokens, user);

      // Redirect to home page
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-900">Login —</h1>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required label={''}            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required label={''}            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/reset-password"
              className="text-black underline hover:text-gray-700"
            >
              Forgot your password?
            </Link>
            <Link
              href="/register"
              className="text-black underline hover:text-gray-700"
            >
              Create account
            </Link>
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
