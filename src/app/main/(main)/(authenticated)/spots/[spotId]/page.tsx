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
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <SpotForm userId={currentUser!.id} spot={spot as any} />
    </main>
  );
}

export default Page;
