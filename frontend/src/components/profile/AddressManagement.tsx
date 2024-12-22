'use client'
import { useState } from 'react'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AddressForm from './AddressForm'

interface Address {
  _id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

interface AddressManagementProps {
  addresses: Address[]
  onUpdate: (addresses: Address[]) => void
}

export default function AddressManagement({ addresses: initialAddresses, onUpdate }: AddressManagementProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddAddress = async (address: Omit<Address, '_id'>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/profile/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(address),
      })

      if (!response.ok) {
        throw new Error('Failed to add address')
      }

      const updatedAddresses = await response.json()
      setAddresses(updatedAddresses)
      onUpdate(updatedAddresses)
      setIsAddingAddress(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAddress = async (addressId: string, address: Partial<Address>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/profile/address/${addressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(address),
      })

      if (!response.ok) {
        throw new Error('Failed to update address')
      }

      const updatedAddresses = await response.json()
      setAddresses(updatedAddresses)
      onUpdate(updatedAddresses)
      setEditingAddress(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/auth/profile/address/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete address')
      }

      const updatedAddresses = await response.json()
      setAddresses(updatedAddresses)
      onUpdate(updatedAddresses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Address List */}
      <div className="grid gap-4">
        {addresses.map((address) => (
          <div
            key={address._id}
            className="p-4 border border-gray-200 rounded-md relative"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {address.street}
                  {address.isDefault && (
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  {address.city}, {address.state} {address.postalCode}
                </p>
                <p className="text-sm text-gray-600">{address.country}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditingAddress(address)}
                  disabled={isLoading}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAddress(address._id!)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Form */}
      {(isAddingAddress || editingAddress) && (
        <AddressForm
          address={editingAddress || undefined}
          onSubmit={editingAddress
            ? (data) => handleUpdateAddress(editingAddress._id!, data)
            : handleAddAddress
          }
          onCancel={() => {
            setIsAddingAddress(false)
            setEditingAddress(null)
          }}
          isLoading={isLoading}
        />
      )}

      {/* Add Address Button */}
      {!isAddingAddress && !editingAddress && (
        <Button
          onClick={() => setIsAddingAddress(true)}
          className="w-full md:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      )}
    </div>
  )
}