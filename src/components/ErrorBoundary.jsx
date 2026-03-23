import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-svh flex items-center justify-center bg-slate-50 p-4">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-lg font-bold text-slate-800 mb-2">An error occurred</h1>
            <p className="text-sm text-slate-500 mb-4">Something went wrong while displaying the app.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-medium"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
