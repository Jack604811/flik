import {
  APP_LANG,
} from "@/app_settings";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { TailwindScreen } from "@/components/dev/tailwind-screen";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import { getSiteData } from "@/server/actions/domain.action";



export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { domain: string };
}>) {
    const domain = decodeURIComponent(params.domain);
  const siteData = await getSiteData(domain);
  return (
      <html lang={APP_LANG}>
        <head key="head">
        <title>{siteData?.siteName ?? "Spot Page"}</title>
        <link
          rel="icon"
          type="image/x-icon"
          href={siteData?.favicon ?? "/placeholder.svg"}
        />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={siteData?.favicon ?? "/placeholder.svg"}
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href={siteData?.favicon ?? "/placeholder.svg"} color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <script type="text/javascript" src="https://checkout.wompi.co/widget.js" async></script>
        </head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system">
            <NextTopLoader />
            <Toaster position="top-center" />
            {children}
            {process.env.NODE_ENV === 'development' &&<TailwindScreen />}
          </ThemeProvider>
        </body>
      </html>
  );
}