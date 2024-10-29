import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';


const Header = dynamic(() =>
  import('@/components/main/header').then((mod) => mod.Header), { ssr: false }
);

const Sidebar = dynamic(() =>
  import('@/components/main/sidebar').then((mod) => mod.Sidebar), { ssr: false }
);

const Docker = dynamic(() =>
  import('@/components/main/docker').then((mod) => mod.Docker), { ssr: false }
);

function Loader() {
  return <div>Loading...</div>;
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full flex-row relative overflow-hidden">
      <Suspense fallback={<Loader />}>
        <Sidebar />
      </Suspense>

      <div className="flex flex-col w-full overflow-y-scroll pb-16 lg:pb-0">
        <Suspense fallback={<Loader />}>
          <Header />
        </Suspense>
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
