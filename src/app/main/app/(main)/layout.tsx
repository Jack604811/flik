"use client";

import React from "react";
import Sidebar from "@/components/main/sidebar";
import Docker from "@/components/main/docker";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-full overflow-y-scroll pb-16 lg:pb-0">
        {children}
      </div>

      {/* Docker */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 lg:hidden">
        <Docker />
      </div>
    </div>
  );
}
