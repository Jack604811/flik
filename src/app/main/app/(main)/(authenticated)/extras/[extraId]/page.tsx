import React from 'react';
import ExtrasForm from '@/components/forms/ExtrasForm';
import { getExtraById } from '@/server/actions/extra.action';
import { redirect } from 'next/navigation';
import { getCurrentWorkspace } from '@/server/actions/user.action';

async function Page({params: { extraId }}: {params: {extraId: string}}) {
  const currentWorkspace = await getCurrentWorkspace();
  const extra = await getExtraById(extraId);

  if(!extra) redirect("/extras/new")
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <ExtrasForm workspaceId={currentWorkspace!.id} extra={extra as any} />
    </main>
  );
}

export default Page;