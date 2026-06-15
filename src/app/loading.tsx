export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0E0B28 0%, #1E1B4B 50%, #0E0B28 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {/* Animated spinner */}
        <div
          style={{
            width: 48,
            height: 48,
            margin: '0 auto 1.5rem',
            border: '3px solid rgba(124,58,237,0.2)',
            borderTopColor: '#7C3AED',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />

        <p
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#9CA3AF',
            letterSpacing: '0.025em',
          }}
        >
          Loading…
        </p>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
