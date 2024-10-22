/* eslint-disable react/no-unescaped-entities */
import { getSiteSpotData, getSiteData } from "@/server/actions/domain.action";
import React from "react";
import Link from "next/link";
import SpotDetails from "./_components/SpotDetails";

async function Page({
  params,
}: {
  params: { spotId: string; domain: string };
}) {
  const domain = decodeURIComponent(params.domain);
  const spotData = await getSiteSpotData(domain, params.spotId);
  const siteData = await getSiteData(domain);

  if (!spotData)
    return (
      <div>
        <h1>Did you get lost?</h1>
        <div>
          <Link
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            href={`/`}
          >
            Home
          </Link>
        </div>
      </div>
    );

  return (
    <div>
      <SpotDetails spot={spotData} siteData={siteData || {}} />
    </div>
  );
}

export default Page;
