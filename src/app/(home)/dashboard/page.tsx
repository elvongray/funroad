'use client';

import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-4 animate-fade-in">
            Welcome to Your Dashboard!
          </h1>
          <p className="text-lg text-gray-700 mb-6 animate-slide-up">
            This content is only visible to authenticated users.
          </p>
          <p className="text-md text-gray-600">
            Feel free to explore your personalized content.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
