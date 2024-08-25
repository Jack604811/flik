import Link from "next/link";
import { APP_DESCRIPTION, APP_NAME, APP_ROUTES } from "@/app_settings";
export function Footer() {
  const baseLinks = APP_ROUTES; // or custom ones if you prefer

  const legalLinks = [
    { name: "Terms of services", path: "/terms-of-service" },
    { name: "Privacy policy", path: "/privacy-policy" },
  ];

  const moreLinks = [
    { name: "Docs", path: "/docs" },
    { name: "Roadmap", path: "roadmap" },
    { name: "Changelog", path: "changelog" },
  ];

  return (
    <footer className="bg-base-200 border-t ">
      <div className="max-w-7xl mx-auto px-8 py-24">
        <div className=" flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          <div className="w-80 max-w-full flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <a
              aria-current="page"
              className="flex gap-2 justify-center md:justify-start items-center"
              href="/#"
            >
              <strong className="font-extrabold tracking-tight text-base md:text-lg">
                {APP_NAME}
              </strong>
            </a>
            <p className="mt-3 text-sm  leading-relaxed">
              {APP_DESCRIPTION}
              <br />
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>

            {/**
             * Remove this div if you want to remove the watermark
             * You can also add a "hidden" class, this will hide the watermark but
             * I will be able to see you are using Shipit and feature you in the showcase
             */}
            <Link
              className="inline-block mt-4 text-sm border cursor-pointer rounded  px-2 py-1"
              href="https://shipit.so"
              rel="noopener noreferrer"
            >
              <div className="flex gap-1 items-center">
                <span>Built with</span>
                <span className="font-bold flex gap-0.5 items-center tracking-tight">
                  Love
                </span>
                <span className="gap-0.5">❤️</span>
              </div>
            </Link>
            {/**
             * End of watermark
             */}
          </div>
          <div className="flex-grow flex flex-wrap md:pl-24 -mb-10 md:mt-0 mt-10 text-center md:text-left">
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold  tracking-widest text-sm md:text-left mb-3">
                LINKS
              </div>
              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                {baseLinks.filter(route => route.visibleBy === 'all').map((link) => (
                  <FooterLink key={link.path} href={link.path}>
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold  tracking-widest text-sm md:text-left mb-3">
                LEGAL
              </div>
              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                {legalLinks.map((link) => (
                  <FooterLink key={link.path} href={link.path}>
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold  tracking-widest text-sm md:text-left mb-3">
                RESOURCES
              </div>
              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                {moreLinks.map((link) => (
                  <FooterLink key={link.path} href={link.path}>
                    {link.name}
                  </FooterLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  children: React.ReactNode;
  href: string;
}

function FooterLink({ children, href }: FooterLinkProps) {
  return (
    <Link className="hover:text-foreground/90 transition-colors" href={href}>
      {children}
    </Link>
  );
}
