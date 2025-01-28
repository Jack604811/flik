import React from 'react';
import SpotForm from '@/components/forms/spot-form';
import { getCurrentWorkspace } from '@/server/actions/user.action';

export const metadata = {
  title: 'Create a New Spot',
};

async function Page() {
  const currentWorkspace = await getCurrentWorkspace();

  return (
    <main className="gap-4 px-2 md:px-4 mb-24 md:mb-0">
      <SpotForm workspaceId={currentWorkspace!.id} />
    </main>
  );
}

export default Page;
