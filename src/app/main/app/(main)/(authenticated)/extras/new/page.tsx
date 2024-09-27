import React from 'react';
import ExtrasForm from '@/components/forms/ExtrasForm';
import { getCurrentWorkspace } from '@/server/actions/user.action';

async function Page() {
  const currentWorkspace = await getCurrentWorkspace();
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <ExtrasForm workspaceId={currentWorkspace!.id} />
    </main>
  );
}

export default Page;
