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
```

---

🔧 Alternative: Direct HTML Integration

If you prefer to have the HTML directly in the component (better for performance), here's the alternative:

```tsx
// app/page.tsx (Alternative - Direct HTML)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already verified
    const isVerified = sessionStorage.getItem('otpVerified');
    const username = sessionStorage.getItem('loginUsername');

    if (isVerified === 'true' && username) {
      router.push('/dashboard');
    }
  }, [router]);

  // Inject the HTML from index.html
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      // This is your exact HTML from index.html
      root.innerHTML = `
        <!-- PASTE YOUR ENTIRE index.html CONTENT HERE -->
        <!-- Including all styles and scripts -->
      `;
      
      // Re-run any scripts
      const scripts = root.querySelectorAll('script');
      scripts.forEach((script) => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript);
      });
    }
  }, []);

  return <div id="root"></div>;
}
```

---

🚀 Better Approach: Next.js App Router with Layout

Since you're using Next.js App Router, a cleaner approach is to use a layout that renders your HTML:

Option 1: Use app/page.tsx with Server Component

```tsx
// app/page.tsx (Server Component)
import fs from 'fs';
import path from 'path';
import { headers } from 'next/headers';

export default async function HomePage() {
  // Read the HTML file from public directory
  const htmlPath = path.join(process.cwd(), 'public', 'index.html');
  let htmlContent = '';
  
  try {
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  } catch (error) {
    console.error('Error reading index.html:', error);
    htmlContent = '<div>Error loading page</div>';
  }

  // Check if user is authenticated via session
  // This is a server component, so we can't use sessionStorage here
  // We'll handle redirects on the client side

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      suppressHydrationWarning
    />
  );
}
```

Option 2: Use Layout with Client Component (Recommended)

Create a separate layout for the login page:

```tsx
// app/layout.tsx (Modified)
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Navy Federal Credit Union - Digital Banking',
  description: 'Welcome to Navy Federal Credit Union Digital Banking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Your existing head elements */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
```

```tsx
// app/page.tsx (Simplified)
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already verified
    const isVerified = sessionStorage.getItem('otpVerified');
    const username = sessionStorage.getItem('loginUsername');

    if (isVerified === 'true' && username) {
      router.push('/dashboard');
    }

    // Load the HTML content
    const loadContent = async () => {
      try {
        const response = await fetch('/index.html');
        const html = await response.text();
        
        const root = document.getElementById('root');
        if (root) {
          root.innerHTML = html;
        }
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, [router]);

  return <div id="root" />;
}
```

---

🎯 Simplest Working Solution

If you want the simplest solution that works immediately:

```tsx
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



