'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import PersonalInformation from '@/components/profile/PersonalInformation';
import AddressManagement from '@/components/profile/AddressManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  addresses: Array<{
    _id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>;
}

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-36">
      <h1 className="text-3xl font-serif mb-8">My Profile —</h1>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInformation
            user={userProfile!}
            onUpdate={(updatedProfile) => setUserProfile(updatedProfile)}
          />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressManagement
            addresses={userProfile?.addresses || []}
            onUpdate={(updatedAddresses) =>
              setUserProfile((prev) =>
                prev
                  ? {
                      ...prev,
                      addresses: updatedAddresses,
                    }
                  : null
              )
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
