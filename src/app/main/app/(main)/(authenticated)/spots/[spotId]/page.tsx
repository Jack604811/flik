import React from 'react';
import SpotForm from '@/components/forms/spot-form';
import { getSpotById } from '@/server/actions/spot.action';
import { redirect } from 'next/navigation';
import { getCurrentWorkspace } from '@/server/actions/user.action';

export const revalidate = 0

async function Page({params: { spotId }}: {params: {spotId: string}}) {
  const currentWorkspace = await getCurrentWorkspace();
  const spot = await getSpotById(spotId);

  if(!spot) redirect("/spots/new")

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <SpotForm workspaceId={currentWorkspace!.id} spot={spot as any} />
    </main>
  );
}

export default Page;
