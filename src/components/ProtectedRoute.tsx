import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../app/AuthProvider';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Prevents access to children routes if the user is not authenticated.
 * Redirects to the login page (/) if unauthenticated.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
