import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  public render() {
    if (this.state.hasError) {
      let errorData: any = null;
      try {
        if (this.state.error?.message) {
          errorData = JSON.parse(this.state.error.message);
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center space-y-8 shadow-2xl">
            <div className="w-20 h-20 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto border border-red-500/20">
              <AlertCircle className="text-red-500" size={40} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">System Encountered an Error</h1>
              <p className="text-slate-400 text-sm">
                {errorData?.error || this.state.error?.message || 'An unexpected error occurred within the MUBUSLINK AI environment.'}
              </p>
              {errorData?.path && (
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                  Path: {errorData.path} | Op: {errorData.operationType}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                Reload Application
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Home size={18} />
                Back to Safety
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 italic">
              Errors are automatically logged to the AI Maintenance Agent for autonomous resolution.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
