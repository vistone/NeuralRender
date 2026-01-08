import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full bg-[#020617] text-slate-200 items-center justify-center p-8">
          <div className="max-w-md w-full bg-[#0f172a] border border-red-500/20 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-500/10 p-3 rounded-xl">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Application Error</h1>
                <p className="text-sm text-slate-400">Something went wrong</p>
              </div>
            </div>
            
            {this.state.error && (
              <div className="bg-black/40 rounded-xl p-4 border border-slate-800">
                <p className="text-xs font-mono text-red-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <button
              onClick={this.handleReset}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <RefreshCw size={16} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
