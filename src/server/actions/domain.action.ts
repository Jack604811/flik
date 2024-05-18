"use server";

import { unstable_cache } from "next/cache";
import { db } from "../db";

export const getSiteData = async (domain: string) => {
    const subdomain = domain.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`)
    ? domain.replace(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, "")
    : null;

    const fetcher = unstable_cache(
        async () => db.user.findUnique({where: subdomain? {subdomain}: {customDomain: domain}, include: {spots: true}}),
        [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
    )

    return await fetcher()
}