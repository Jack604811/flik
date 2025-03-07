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
        <div className="h-screen">
        <EmptyState
          imageUrl="/placeholder.svg"
          title="Oops! Something went wrong."
          description="We encountered an error. Please try reloading the page."
          buttonLabel="Reload Page"
          onButtonClick={this.handleReload}
        />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;