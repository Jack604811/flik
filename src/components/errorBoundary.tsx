"use client";

import React, { Component, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";

class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center p-4">
          <h1 className="text-2xl font-bold">Oops! Something went wrong.</h1>
          <p className="text-lg mb-4 text-muted-foreground">
            We encountered an error. Please try reloading the page.
          </p>
          <Button onClick={this.handleReload} variant="default">
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;