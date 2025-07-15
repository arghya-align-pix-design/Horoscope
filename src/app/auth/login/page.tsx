'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Lib/fireBaseConfig';

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  //Login operation
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sign in user
        const userCred = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
        );

      //Getting JWT token from Firebase
      const token = await userCred.user.getIdToken();

      //Store token in localStorage (optional: use cookies for SSR later)
      //if(token)
      const encoded= btoa(token);
      
      localStorage.setItem('token', encoded);
      
      console.log('🔐 JWT token saved and encoded to base 64:',encoded);

      //Redirecting to dashboard
      router.push('/dashboard');

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 to-pink-200">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600">Login</h2>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-pink-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-pink-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
