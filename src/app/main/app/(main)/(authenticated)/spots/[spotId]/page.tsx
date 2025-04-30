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
    <main className="gap-4 px-0 md:px-0 mb-24 md:mb-0">
        <SpotForm workspaceId={currentWorkspace!.id} spot={spot as any} />
    </main>
  );
}

export default Page;
