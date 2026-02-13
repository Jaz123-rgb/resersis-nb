'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20">
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        Algo salió mal
      </h3>
      <p className="text-red-700 dark:text-red-300 mb-4">
        {error.message}
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Reintentar
      </button>
    </div>
  );
}

export default ErrorBoundary;
