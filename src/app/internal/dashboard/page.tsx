'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface UserData {
  user_type: string;
}

export default function InternalDashboard() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }

        if (!user) {
          router.push('/login');
          return;
        }

        setUserEmail(user.email || null);
        
        // Get user type
        const { data, error: typeError } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single<UserData>();
          
        if (typeError) {
          throw typeError;
        }

        if (data) {
          setUserType(data.user_type || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Dashboard error:', err);
      }
    };
    if (mounted) {
      getUser();
    }
  }, [router, mounted, supabase]);

  if (!mounted) {
    return null;
  }

  if (error) {
    return (
      <div suppressHydrationWarning className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="bg-white shadow rounded-lg p-6">
      <div className="border-b border-gray-200 pb-5">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Welcome to Dashboard
        </h3>
        {userEmail && (
          <p className="mt-2 text-sm text-gray-600">
            Logged in as: {userEmail} ({userType})
          </p>
        )}
      </div>
      
      <div className="mt-6">
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Dashboard Overview
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This is a placeholder for the dashboard. Future features will include:
                </p>
                <ul className="list-disc list-inside mt-2">
                  <li>Business analytics</li>
                  <li>Project management</li>
                  <li>Team collaboration</li>
                  <li>Resource planning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
