'use client'

import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-gray-900">Sign Up —</h1>
        </div>
        <form className="space-y-6">
          <div>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required
            />
          </div>
          <div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required
            />
          </div>
          <div>
            <Input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-gray-200 focus:border-gray-400"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-black hover:bg-gray-900 text-white py-3 rounded-md transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Create
          </Button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-black underline hover:text-gray-700">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

