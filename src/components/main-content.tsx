import React from 'react';
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import TanstackQueryProvider from "@/components/providers/TanstackQueryProvider";
import ErrorBoundary from "@/components/errorBoundary";
import { NextAuthProvider } from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/main/theme-provider";

type Props = {
  children?: React.ReactNode;
  basePath?: string;
};

export default function MainContent({ children, basePath }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <NextAuthProvider basePath={basePath}>
        <NextTopLoader />
        <Toaster position="bottom-center" />
        <TanstackQueryProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </TanstackQueryProvider>
      </NextAuthProvider>
    </ThemeProvider>
  );
}
