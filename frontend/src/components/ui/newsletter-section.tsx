'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add newsletter subscription logic here
    console.log('Subscribing email:', email)
    setEmail('')
  }

  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-medium mb-2">Subscribe now & get 20% off</h2>
      <p className="text-gray-500 mb-8">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
        <Input
          type="email"
          placeholder="Enter your email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
          required label={''}        />
        <Button type="submit">
          SUBSCRIBE
        </Button>
      </form>
    </div>
  )
}

