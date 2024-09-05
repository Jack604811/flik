"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";  
import ShimmerButton from "../magicui/shimmer-button";

export default function ShimmerButtonWithSession() {
  const { data: session } = useSession(); 

  return (
    <>
      {session?.user ? (
        <Link href="/dashboard">
          <ShimmerButton>
            <span className="text-sm text-background dark:text-primary">
              Dashboard
            </span>
          </ShimmerButton>
        </Link>
      ) : (
        <Link href="/signin">
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
