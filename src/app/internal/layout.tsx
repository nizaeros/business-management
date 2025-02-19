'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch by not rendering until client-side
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Business Management Platform</h1>
          <button
            onClick={handleSignOut}
            className="rounded-md bg-[#1034A6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1034A6]/80 focus:outline-none focus:ring-2 focus:ring-[#1034A6] focus:ring-offset-2"
          >
            Sign Out
          </button>
        </div>
      </header>
      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
