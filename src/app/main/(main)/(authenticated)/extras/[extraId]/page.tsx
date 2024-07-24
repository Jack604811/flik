import React from 'react';
import { getCurrentUser } from '@/server/auth';
import ExtrasForm from '@/components/forms/ExtrasForm';
import { getExtraById } from '@/server/actions/extra.action';
import { redirect } from 'next/navigation';

async function Page({params: { extraId }}: {params: {extraId: string}}) {
  const currentUser = await getCurrentUser();
  const extra = await getExtraById(extraId);

  if(!extra) redirect("/extras/new")
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <ExtrasForm userId={currentUser!.id} extra={extra as any} />
    </main>
  );
}

export default Page;
