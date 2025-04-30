import { NextRequest, NextResponse } from "next/server";
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    {
      source: "/((?!api/(?!partners)|_next/|_static/|_vercel|[\\w-]+\\.\\w+|assets/|sites/).*)",
      missing: [
        // { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "next-action" },
        // { type: "header", key: "purpose", value: "prefetch" },
      ],
    }

  ],
};

export default async function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = req.nextUrl.searchParams.toString();

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    headers.set("x-current-path", req.nextUrl.pathname);
  
    return NextResponse.rewrite(
      new URL(`/main/public${path === "/" ? "" : path}`, req.url), { headers }
    );
  }
  
  
  if (hostname == `api.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {

    return NextResponse.rewrite(
      new URL(`/api/partners${path === "/" ? "" : path}`, req.url), {headers}
    );
  }



  // rewrites for app pages
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    headers.set("x-current-path", url.pathname);
    headers.set("x-search-params",  url.searchParams.toString());

    return NextResponse.rewrite(
      new URL(`/main/app${path === "/" ? "" : path}`, req.url), {headers}
    );
  }

  // rewrites for app pages
  if (hostname == `admin.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    headers.set("x-current-path", req.nextUrl.pathname);

    return NextResponse.rewrite(
      new URL(`/main/admin${path === "/" ? "" : path}`, req.url), {headers}
    );
  }

  if(hostname.endsWith(process.env.NEXT_PUBLIC_ROOT_DOMAIN!)){
    const res = await fetch(new URL(`/api/domain/${hostname}/user`, req.url));
    const resData = await res.json();

    if(resData.redirect){
      return NextResponse.redirect(`https://${resData.domain}${path === "/" ? "" : path}`)
    }

  }


//   // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(
    new URL(`/${hostname}${path === "/" ? "" : path}`, req.url)
  );
}
