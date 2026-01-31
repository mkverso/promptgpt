import React, { useState, useEffect } from 'react';
import { useAuth } from '../app/AuthProvider';
import { verifyCredentials } from '../utils/security';

interface LoginFormProps {
    onSuccess: () => void;
}

/**
 * LoginForm Component (Refined)
 * 
 * Implements strict validation rules and improved UX:
 * - Validation: Username (min 4, alphanumeric), Password (min 6, not empty).
 * - Security: Credentials are verified using an obfuscated combined hash.
 * - UX: Errors show only after interaction (touched). Button disabled until valid.
 */
export function LoginForm({ onSuccess }: LoginFormProps) {
    const { login } = useAuth();

    // Field State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Touched State (to track interaction)
    const [touched, setTouched] = useState({ username: false, password: false });

    // Error State
    const [errors, setErrors] = useState({ username: '', password: '', form: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validation Logic
    const validate = () => {
        const newErrors = { username: '', password: '', form: '' };
        let isValid = true;

        const usernameRegex = /^[a-zA-Z0-9]+$/;
        if (!username) {
            newErrors.username = 'Username is required';
            isValid = false;
        } else if (username.length < 4) {
            newErrors.username = 'Username must be at least 4 characters';
            isValid = false;
        } else if (!usernameRegex.test(username)) {
            newErrors.username = 'Username must be alphanumeric';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        return { isValid, newErrors };
    };

    useEffect(() => {
        const { newErrors } = validate();
        setErrors(prev => ({ ...prev, username: newErrors.username, password: newErrors.password }));
    }, [username, password]);

    const { isValid } = validate();

    const handleBlur = (field: 'username' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid || isSubmitting) return;

        setIsSubmitting(true);
        setErrors(prev => ({ ...prev, form: '' }));

        try {
            // Verify using security utility
            const isAuthorized = await verifyCredentials(username, password);

            if (isAuthorized) {
                login(); // Update auth context
                onSuccess();
            } else {
                setErrors(prev => ({ ...prev, form: "Invalid credentials" }));
            }
        } catch (error) {
            console.error("Login handling error:", error);
            setErrors(prev => ({ ...prev, form: "An error occurred during login" }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form-wrap">
            {/* Username Field */}
            <div className="form-field-group">
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => handleBlur('username')}
                    disabled={isSubmitting}
                    autoComplete="username"
                    className="login-input"
                    style={{
                        borderColor: touched.username && errors.username ? '#ff6b6b' : 'inherit'
                    }}
                />
                {touched.username && errors.username && (
                    <span className="error-text">{errors.username}</span>
                )}
            </div>

            {/* Password Field */}
            <div className="form-field-group">
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur('password')}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                    className="login-input"
                    style={{
                        borderColor: touched.password && errors.password ? '#ff6b6b' : 'inherit'
                    }}
                />
                {touched.password && errors.password && (
                    <span className="error-text">{errors.password}</span>
                )}
            </div>

            {/* Global Form Error */}
            {errors.form && (
                <div className="form-error-summary">
                    {errors.form}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="login-submit-btn"
            >
                {isSubmitting ? 'Verifying...' : 'Login'}
            </button>
        </form>
    );
}
