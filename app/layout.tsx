// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [htmlContent, setHtmlContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is already verified
    const isVerified = sessionStorage.getItem('otpVerified');
    const username = sessionStorage.getItem('loginUsername');

    if (isVerified === 'true' && username) {
      router.push('/dashboard');
      return;
    }

    // Load the HTML content
    const loadHTML = async () => {
      try {
        const response = await fetch('/index.html');
        const html = await response.text();
        setHtmlContent(html);
      } catch (error) {
        console.error('Error loading HTML:', error);
        setHtmlContent('<div>Error loading page</div>');
      }
    };

    loadHTML();
  }, [router]);

  // Use dangerouslySetInnerHTML to inject the HTML
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      suppressHydrationWarning
    />
  );
}