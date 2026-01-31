
interface PageLoadingProps {
    message?: string;
}

/**
 * PageLoading Component
 * 
 * A full-screen loading overlay with a spinning logo and custom message.
 * Extracted from Login.tsx to be used as a global route fallback.
 */
export function PageLoading({ message = 'Entering LiteGPT...' }: PageLoadingProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem',
            animation: 'fadeIn 0.5s ease'
        }}>
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            <img
                src="/favicon.png"
                alt="Logo"
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    animation: 'spin 2s linear infinite'
                }}
            />
            <h2 style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>{message}</h2>
        </div>
    );
}
