"use client";

import React, { createContext, useContext } from "react";

interface Workspace {
  id: string;
  name?: string;
}

interface WorkspaceProviderProps {
  currentWorkspace: Workspace | null;
}

const WorkspaceContext = createContext<WorkspaceProviderProps | undefined>(undefined);

export const WorkspaceProvider = ({
  children,
  currentWorkspace,
}: {
  children: React.ReactNode;
  currentWorkspace: Workspace | null;
}) => {
  return (
    <WorkspaceContext.Provider value={{ currentWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};
