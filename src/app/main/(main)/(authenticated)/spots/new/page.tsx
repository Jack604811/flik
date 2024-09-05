import React from 'react';
import { getCurrentUser } from '@/server/auth';
import SpotForm from '@/components/forms/SpotForm';

async function Page() {
  const currentUser = await getCurrentUser();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <SpotForm userId={currentUser!.id} />
    </main>
  );
}

export default Page;
