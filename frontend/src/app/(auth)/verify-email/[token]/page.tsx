'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
  const router = useRouter();
  const params = useParams();
  const { token } = params;
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/auth/verify-email/${token}`,
          {
            method: 'POST',
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Verification failed');
        }

        setStatus('success');
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setStatus('error');
      }
    };

    verifyEmail();
  }, [params.token, router, token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-900">
            Email Verification —
          </h1>

          {status === 'loading' && (
            <p className="mt-4 text-gray-600">
              Verifying your email address...
            </p>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <p className="mt-4 text-gray-600">
                Your email has been successfully verified!
              </p>
              <p className="text-sm text-gray-600">
                Redirecting to login page...
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-black hover:bg-gray-900 text-white"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="mt-4 text-red-600">
                {error || 'Failed to verify email'}
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-black hover:bg-gray-900 text-white"
              >
                Go to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
