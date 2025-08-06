'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('signin'); // Redirect to Next-Auth's default sign-in page
    }
  }, [status, router]);

  if (status === 'loading') {
    // Optionally, show a loading spinner or skeleton while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Loading authentication...</p>
      </div>
    );
  }

  // If authenticated, render the children
  if (session) {
    return <>{children}</>;
  }

  // If unauthenticated and not loading, this state should ideally be caught by the useEffect
  // but as a fallback, you might return null or a message.
  return null;
}
