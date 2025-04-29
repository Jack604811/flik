"use client";

import React, { Component, ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./main/empty-state";

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
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              imageUrl="/placeholder.svg"
              title="Oops! Something went wrong."
              description="We encountered an error. Please try reloading the page."
            />
            <Button onClick={this.handleReload}>Reload Page</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;