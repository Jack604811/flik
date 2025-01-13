"use client";

import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
  basePath?: string;
};

export const NextAuthProvider = ({ children, basePath }: Props) => {
  return <SessionProvider basePath={basePath}>{children}</SessionProvider>;
};
