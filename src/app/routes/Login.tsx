import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginForm } from '../../components/LoginForm';
import { ThemeToggle } from '../../components/ThemeToggle';
import { PageLoading } from '../../components/PageLoading';

/**
 * Login Page
 * 
 * The entry point for unauthenticated users.
 * 
 * LOGIC:
 * - Uses `useNavigate` hook from react-router-dom for navigation.
 * - Renders the `LoginForm` component.
 * - Passes a success callback to `LoginForm` that triggers navigation to `/chat`.
 * 
 * WHY:
 * - Separates PAGE logic (navigation, layout) from FORM logic (validation, state).
 * - "Smart" container (Login Page) vs "Dumb" presentational component (LoginForm).
 */
export function Login() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSuccess = () => {
        setIsLoading(true);
        // Simulate loading / context switch
        setTimeout(() => {
            navigate('/chat', { replace: true });
        }, 1500);
    };

    if (isLoading) {
        return <PageLoading />;
    }

    return (
        <div className="login-container">
            <ThemeToggle className="theme-toggle-login" />
            <img
                src="/favicon.png"
                alt="Logo"
                className="login-logo"
            />
            <h1>LiteGPT Web</h1>
            <LoginForm onSuccess={handleLoginSuccess} />

            <div className="login-credit-wrapper">
                Built by <span className="credit-name"><a href="https://murali-k-portfolio.vercel.app/">Murali</a></span>
            </div>
        </div>
    );
}
