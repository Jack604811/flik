import { getSiteData } from "@/server/actions/domain.action";
import React from "react";

async function DomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { domain: string };
}) {
    const domain = decodeURIComponent(params.domain);
    const siteData = await getSiteData(domain)
    // TODO: Check the domain to extract the subdomain if it's a subdomain under our main domain else note that it's a custom domain.
    // Check if the subdomain/customDomain exists in the database then show the page else show a 404.
  return <div>
    {children} {domain} : 
    <div className="m-5 p-5 border-2 bg-slate-600">
        {JSON.stringify(siteData)}
    </div>
    </div>;
}

export default DomainLayout;
