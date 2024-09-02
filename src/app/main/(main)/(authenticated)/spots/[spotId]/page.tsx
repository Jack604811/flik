import React from 'react';
import SpotForm from '@/components/forms/SpotForm';
import { getCurrentUser } from '@/server/auth';
import { getSpotById } from '@/server/actions/spot.action';
import { redirect } from 'next/navigation';

export const revalidate = 0

async function Page({params: { spotId }}: {params: {spotId: string}}) {
  const currentUser = await getCurrentUser();
  const spot = await getSpotById(spotId);

  if(!spot) redirect("/spots/new")

  return (
    <main className="flex-1 p-6 pt-4 space-y-8 md:p-8 md:pt-6">
        <SpotForm userId={currentUser!.id} spot={spot as any} />
    </main>
  );
}

export default Page;
