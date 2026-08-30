// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in (OTP verified)
    const isVerified = sessionStorage.getItem('otpVerified');
    const storedUsername = sessionStorage.getItem('loginUsername');

    if (isVerified === 'true' && storedUsername) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add your login logic here (e.g., API call)
    // For now, just log the inputs
    console.log('Attempting login with:', { username, password });

    // Example: 
    // if (username === 'test' && password === '1234') {
    //   sessionStorage.setItem('otpVerified', 'true');
    //   sessionStorage.setItem('loginUsername', username);
    //   router.push('/dashboard');
    // } else {
    //   setError('Invalid credentials');
    // }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-navy-700">Login</h1>
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-500 focus:border-navy-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-navy-700 text-white font-semibold rounded-md hover:bg-navy-800 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}