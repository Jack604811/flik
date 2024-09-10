"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";  
import ShimmerButton from "../magicui/shimmer-button";
import { APP_DOMAIN } from "@/app-settings";

export default function ShimmerButtonWithSession() {
  const { data: session } = useSession(); 

  return (
    <>
      {session?.user ? (
        <Link href={`//app.${APP_DOMAIN}/dashboard`}>
          <ShimmerButton>
            <span className="text-sm text-background dark:text-primary">
              Dashboard
            </span>
          </ShimmerButton>
        </Link>
      ) : (
        <Link href={`//app.${APP_DOMAIN}/signin`}>
          <ShimmerButton>
            <span className="text-sm text-background dark:text-primary">
              Get started
            </span>
          </ShimmerButton>
        </Link>
      )}
    </>
  );
}
