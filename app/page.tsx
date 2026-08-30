// app/page.tsx
'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Redirect to index.html
    window.location.href = '/index.html';
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <p>Redirecting to login...</p>
    </div>
  );
}