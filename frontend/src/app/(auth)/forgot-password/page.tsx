'use client'

import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-900">Reset Password —</h1>
        </div>
        <form className="space-y-6">
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Send Reset Link
          </Button>
          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="text-black underline hover:text-gray-700">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

