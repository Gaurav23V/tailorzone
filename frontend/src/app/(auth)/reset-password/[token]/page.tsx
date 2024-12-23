'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ResetPasswordConfirm() {
  // Removed params from props
  const router = useRouter();
  const params = useParams(); // Use useParams to unwrap params
  const { token } = params; // Destructure token from params
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/password-reset/${token}`, // Use destructured token
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reset password');
      }

      setSuccess(true);
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-gray-900">
              Password Reset Successful —
            </h1>
            <p className="mt-4 text-gray-600">
              Your password has been successfully reset. Redirecting to login
              page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-900">
            Reset Password —
          </h1>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="password"
              name="password"
              placeholder="New Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required
              minLength={6} label={''}            />
          </div>
          <div>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required
              minLength={6} label={''}            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
