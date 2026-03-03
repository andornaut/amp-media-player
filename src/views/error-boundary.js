import { Component } from 'react';

import { initState } from '../actions/init';
import './error-boundary.css';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = async () => {
    await initState();
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (error) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <button onClick={this.handleRetry} type="button">
            Try again
          </button>
        </div>
      );
    }
    return children;
  }
}
