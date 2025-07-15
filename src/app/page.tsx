// /app/page.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-purple-700">🔮 Welcome to AstroGuide</h1>
        <p className="text-gray-600 text-md">
          Discover your destiny through personalized horoscopes, birth charts, and more.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow hover:bg-purple-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => router.push('/auth/signup')}
            className="border border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-100 transition"
          >
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
