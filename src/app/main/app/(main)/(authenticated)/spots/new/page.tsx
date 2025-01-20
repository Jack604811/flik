import React from 'react';
import SpotForm from '@/components/forms/spot-form';
import { getCurrentWorkspace } from '@/server/actions/user.action';

export const metadata = {
  title: 'Create a New Spot',
};

async function Page() {
  const currentWorkspace = await getCurrentWorkspace();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
      <SpotForm workspaceId={currentWorkspace!.id} />
    </main>
  );
}

export default Page;
