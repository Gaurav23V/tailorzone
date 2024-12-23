'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface UpdatedUser {
  firstName: string;
  lastName: string;
  phone?: string;
}

interface PersonalInformationProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  onUpdate: (updatedUser: UpdatedUser) => void;
}

export default function PersonalInformation({ user, onUpdate }: PersonalInformationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    }
  })

  const onSubmit = async (data: UpdatedUser) => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      onUpdate(updatedUser)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {error && (
        <div className="mb-4 p-4 rounded bg-red-50 text-red-500">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 rounded bg-green-50 text-green-500">
          Profile updated successfully
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Input
              label={''} placeholder="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}            />
          </div>
          <div>
            <Input
              label={''} placeholder="Last Name"
              {...register('lastName')}            />
          </div>
        </div>

        <div>
          <Input
            placeholder="Email"
            value={user.email}
            disabled
            className="bg-gray-50" label={''}          />
          <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
        </div>

        <div>
          <Input
            label={''} placeholder="Phone"
            type="tel"
            {...register('phone')}          />
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}