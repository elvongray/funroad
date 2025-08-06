// app/providers.tsx
'use client';

interface NextAuthSessionProviderProps {
  children: React.ReactNode;
}

import { SessionProvider } from 'next-auth/react';

export default function NextAuthSessionProvider({
  children,
}: NextAuthSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
