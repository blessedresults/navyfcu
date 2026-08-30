// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (OTP verified)
    const isVerified = sessionStorage.getItem('otpVerified');
    const username = sessionStorage.getItem('loginUsername');

    if (isVerified === 'true' && username) {
      // If already verified, redirect to dashboard
      router.push('/dashboard');
    }
    // Otherwise, stay on the login page (index.html)
  }, [router]);

  // This component will render the content from public/index.html
  // We use a useEffect to load the HTML content
  useEffect(() => {
    // If we're on the client side, fetch and inject the HTML
    const loadLoginPage = async () => {
      try {
        const response = await fetch('/index.html');
        const html = await response.text();
        
        // Create a container and inject the HTML
        const container = document.getElementById('root');
        if (container) {
          container.innerHTML = html;
          
          // Re-initialize any scripts in the HTML
          const scripts = container.querySelectorAll('script');
          scripts.forEach((script) => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
          });
        }
      } catch (error) {
        console.error('Error loading login page:', error);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check if we're already on the dashboard
      const isVerified = sessionStorage.getItem('otpVerified');
      const username = sessionStorage.getItem('loginUsername');
      
      if (!(isVerified === 'true' && username)) {
        loadLoginPage();
      }
    }
  }, []);

  return (
    <div id="root">
      {/* This div will be populated with the HTML content */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
}