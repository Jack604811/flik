import React from 'react';
import SpotForm from '@/components/forms/SpotForm';
import { getCurrentUser } from '@/server/auth';
import { getSpotById } from '@/server/actions/spot.action';
import { Spot } from '@prisma/client';


async function Page({params: { spotId }}: {params: {spotId: string}}) {
  const currentUser = await getCurrentUser();
  const spot = await getSpotById(spotId);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        <SpotForm userId={currentUser!.id} spot={spot as any} />
    </main>
  );
}

export default Page;
