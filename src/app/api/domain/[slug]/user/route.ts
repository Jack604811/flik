export const revalidate = 0

import {
    getConfigResponse,
    getDomainResponse,
    verifyDomain,
  } from "@/server/helpers/domains";
  import { NextResponse } from "next/server";
import { getSiteData } from "@/server/actions/domain.action";
  
  export async function GET(
    _req: Request,
    { params }: { params: { slug: string } },
  ) {
    const hostname = decodeURIComponent(params.slug);
    const siteData = await getSiteData(hostname);

    if(siteData?.customDomain){
      const [domainJson, configJson] = await Promise.all([
        getDomainResponse(siteData?.customDomain),
        getConfigResponse(siteData?.customDomain),
      ]);


      if(domainJson.verified && !configJson.misconfigured){
        return NextResponse.json({redirect: true, domain: siteData?.customDomain})
      }
    }

    return NextResponse.json({redirect: false})
  }