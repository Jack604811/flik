import React from 'react';
import { getCurrentUser } from '@/server/auth';
import SpotForm from '@/components/forms/SpotForm';

async function Page() {
  const currentUser = await getCurrentUser();
  return (
    <main className="flex-1 p-6 mt-16 pt-16 space-y-8 md:p-16 md:pt-16">
        <SpotForm userId={currentUser!.id} />
    </main>
  );
}

export default Page;
