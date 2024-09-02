import React from 'react';
import { getCurrentUser } from '@/server/auth';
import SpotForm from '@/components/forms/SpotForm';

async function Page() {
  const currentUser = await getCurrentUser();
  return (
    <main className="flex-1 p-6 pt-4 space-y-8 md:p-8 md:pt-6">
        <SpotForm userId={currentUser!.id} />
    </main>
  );
}

export default Page;
