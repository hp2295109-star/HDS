import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-base text-text-primary flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-card-bg border border-card-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h1 className="text-2xl font-extrabold text-text-primary mb-2">
              Something went wrong
            </h1>

            <p className="text-text-secondary text-xs leading-relaxed mb-6">
              An unhandled client application error occurred. We have logged the event. Try reloading the page or return to the homepage.
            </p>

            {this.state.error && (
              <div className="bg-neutral-950 border border-card-border rounded-xl p-3 mb-6 text-left overflow-x-auto">
                <code className="text-[10px] font-mono text-red-400/90 break-all">
                  {(this.state.error as Error).message || 'Unknown Error'}
                </code>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 bg-accent text-bg-base font-bold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </button>

              <a
                href="/"
                className="px-4 py-2.5 bg-neutral-900 border border-card-border hover:border-accent/40 text-text-primary font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <Home className="w-3.5 h-3.5 text-accent" />
                <span>Home Page</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
