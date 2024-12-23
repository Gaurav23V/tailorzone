'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  // Added state for resending verification
  const [resendLoading, setResendLoading] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      phone: formData.get('phone') as string,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      setUserEmail(data.email);
      setIsRegistered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Added resend verification handler
  const handleResendVerification = async () => {
    setResendLoading(true);
    setResendError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Resend failed');
      }

      // Optionally show a success message
    } catch (err) {
      setResendError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setResendLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-serif text-gray-900">
              Verify Your Email —
            </h1>
            <p className="mt-4 text-gray-600">
              We&apos;ve sent a verification email to <strong>{userEmail}</strong>.
              Please check your inbox and click the verification link to
              complete your registration.
            </p>
          </div>
          <div className="text-center text-sm text-gray-600">
            <p>Did&apos;nt receive the email?</p>
            <Button
              onClick={handleResendVerification}
              variant="link"
              className="text-black underline hover:text-gray-700"
              disabled={resendLoading}
            >
              {resendLoading ? 'Resending...' : 'Resend verification email'}
            </Button>
            {resendError && (
              <div className="mt-2 text-red-500 text-sm">
                {resendError}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-900">Sign Up —</h1>
        </div>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-100 rounded-md focus:outline-none"
                required label={''}              />
            </div>
            <div>
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-100 rounded-md focus:outline-none"
                required label={''}              />
            </div>
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-100 rounded-md focus:outline-none"
              required label={''}            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-100 rounded-md focus:outline-none"
              required label={''}            />
          </div>
          <div>
            <Input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="w-full px-4 py-3 border border-gray-100 rounded-md focus:outline-none"
              required label={''}            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-black underline hover:text-gray-700"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}