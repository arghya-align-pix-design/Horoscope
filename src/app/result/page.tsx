'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [horoscope, setHoroscope] = useState('');

  useEffect(() => {
    const msg = localStorage.getItem('finalHoroscope');
    if (msg) setHoroscope(msg);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-pink-200 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold text-purple-700">🌟 Your Horoscope</h1>
        <p className="text-lg text-gray-800">{horoscope || "No horoscope found. Please go back and try again."}</p>
      </div>
    </div>
  );
}
