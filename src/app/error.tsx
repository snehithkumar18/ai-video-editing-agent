'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0E0B28 0%, #1E1B4B 50%, #0E0B28 100%)',
        fontFamily: "'Inter', sans-serif",
        color: '#F8FAFC',
        padding: '2rem',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.25rem',
          padding: '3rem 2rem',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
          }}
        >
          ⚠️
        </div>

        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            background: 'linear-gradient(135deg, #F8FAFC, #C4B5FD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Something went wrong
        </h2>

        <p
          style={{
            fontSize: '0.938rem',
            lineHeight: 1.6,
            color: '#9CA3AF',
            marginBottom: '2rem',
          }}
        >
          An unexpected error occurred. Our team has been notified.
          {error.digest && (
            <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.8rem', color: '#6B7280' }}>
              Error ID: {error.digest}
            </span>
          )}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              height: '2.75rem',
              padding: '0 1.75rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 100%)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(-1px)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 6px 30px rgba(124,58,237,0.45)';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
              (e.target as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(124,58,237,0.3)';
            }}
          >
            Try again
          </button>

          <a
            href="/"
            style={{
              height: '2.75rem',
              padding: '0 1.75rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: '#C4B5FD',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}
