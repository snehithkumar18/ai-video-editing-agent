import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center landing-dark text-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
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
        {/* 404 number */}
        <div
          style={{
            fontSize: '5rem',
            fontWeight: 900,
            lineHeight: 1,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #7C3AED, #C4B5FD)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: '0.938rem',
            lineHeight: 1.6,
            color: '#9CA3AF',
            marginBottom: '2rem',
          }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            className="btn-gradient"
            style={{
              height: '2.75rem',
              padding: '0 1.75rem',
              borderRadius: '0.75rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            Back to home
          </Link>

          <Link
            href="/dashboard"
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
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
