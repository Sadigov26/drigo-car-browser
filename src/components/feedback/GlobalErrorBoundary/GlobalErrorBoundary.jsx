import { Component } from "react";
import styles from "./GlobalErrorBoundary.module.css";

class GlobalErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className={styles.page}>
          <section className={styles.message} role="alert">
            <p>Application error</p>
            <h1>Something went wrong</h1>
            <span>The page could not be displayed safely.</span>
            <div className={styles.actions}>
              <button type="button" onClick={this.handleRetry}>
                Try again
              </button>
              <a href="/">Back to home</a>
            </div>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;
