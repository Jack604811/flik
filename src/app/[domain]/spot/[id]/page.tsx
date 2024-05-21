import { getSiteSpotData } from "@/server/actions/domain.action";
import { Link } from "lucide-react";
import React from "react";

async function Page({ params }: { params: { id: string; domain: string } }) {
  const domain = decodeURIComponent(params.domain);
  const spotData = await getSiteSpotData(domain, params.id);
  return (
    <div>
      {spotData ? (
        <div>
          <h1>{spotData?.name}</h1>
          <div>{JSON.stringify(spotData)}</div>
        </div>
      ) : (
        <div>
          <h1>Did you get lost?</h1>
          <div>
          <Link
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            href={`/`}
          >
            Home
          </Link>
            </div>
          
        </div>
      )}
    </div>
  );
}

export default Page;
