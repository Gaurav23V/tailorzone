'use client'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface AddressFormProps {
  address?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    isDefault: boolean
  }
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function AddressForm({
  address,
  onSubmit,
  onCancel,
  isLoading
}: AddressFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: address || {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: false,
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Street Address"
        {...register('street', { required: 'Street address is required' })}
        error={errors.street?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          {...register('city', { required: 'City is required' })}
          error={errors.city?.message}
        />

        <Input
          label="State"
          {...register('state', { required: 'State is required' })}
          error={errors.state?.message}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Postal Code"
          {...register('postalCode', { required: 'Postal code is required' })}
          error={errors.postalCode?.message}
        />

        <Input
          label="Country"
          {...register('country', { required: 'Country is required' })}
          error={errors.country?.message}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isDefault"
          {...register('isDefault')}
        />
        <label
          htmlFor="isDefault"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Set as default address
        </label>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}