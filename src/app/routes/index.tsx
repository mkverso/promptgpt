import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './Login';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { PageLoading } from '../../components/PageLoading';

const Chat = lazy(() => import('./Chat').then(m => ({ default: m.Chat })));

/**
 * AppRoutes
 * 
 * Central routing configuration for the application with protected access control.
 */
export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={<Login />} />

                {/* Protected Route */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoading message="Loading Chat..." />}>
                                <Chat />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
