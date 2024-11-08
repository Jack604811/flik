import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const Header = dynamic(() =>
  import('@/components/main/header').then((mod) => mod.Header),
  { ssr: false }
);

const Sidebar = dynamic(() =>
  import('@/components/main/sidebar').then((mod) => mod.Sidebar),
  { ssr: false }
);

const Docker = dynamic(() =>
  import('@/components/main/docker').then((mod) => mod.Docker),
  { ssr: false }
);

function Loader() {
  return <div>Loading...</div>;
}

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { [key: string]: string | string[] };
}) {
  // Extract the route segments from params
  const segments = Object.values(params).flat();

  // Check if 'workspaces' is in the route segments
  const isWorkspacesPath = segments.includes('workspaces');

  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      {!isWorkspacesPath && (
        <div>
          <Suspense fallback={<Loader />}>
            <Sidebar />
          </Suspense>
        </div>
      )}
      <div className="flex flex-col w-full overflow-y-scroll pb-16 lg:pb-0">
      {isWorkspacesPath && (
        <div>
        <Suspense fallback={<Loader />}>
          <Header />
        </Suspense>
        </div>
      )}
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 lg:hidden">
        <Suspense fallback={<Loader />}>
          <Docker />
        </Suspense>
      </div>
    </div>
  );
}
