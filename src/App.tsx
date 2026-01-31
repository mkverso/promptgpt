/**
 * Main Application Component
 * 
 * Root component that wraps the app with theme provider and error boundary.
 * 
 * @component
 */

import { AppRoutes } from './app/routes';
import { ThemeProvider } from './theme/ThemeProvider';
import { AuthProvider } from './app/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
