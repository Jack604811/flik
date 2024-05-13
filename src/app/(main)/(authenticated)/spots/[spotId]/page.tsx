import React from 'react';
import CreateSpotForm from '@/components/forms/CreateSpotForm';
import { getCurrentUser } from '@/server/auth';
import { getSpotById } from '@/server/actions/spot.action';

async function Page({params: { spotId }}: {params: {spotId: string}}) {
  const currentUser = await getCurrentUser();
  const spot = await getSpotById(spotId);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-16 mb-24">
        {JSON.stringify(spot)}
    </main>
  );
}

export default Page;
