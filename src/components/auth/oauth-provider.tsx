"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const OauthProvider = ({
  provider,
  callbackUrl,
  prefix,
}: {
  prefix: string;
  callbackUrl: string;
  provider: { id: string; name: string };
}) => {
  return (
    <Button
      onClick={() => signIn(provider.id, { callbackUrl })}
      className="flex gap-2 items-center justify-center w-full hover:bg-neutral-200/20"
      variant="secondary"
    >
      <Image
        alt={`${provider.name} logo`}
        src={`/assets/icons/nextauth-providers/${provider.id.toLowerCase()}.svg`}
        width={20}
        height={20}
      />
      <span>
        {prefix} with <span className="capitalize">{provider.name}</span>
      </span>
    </Button>
  );
};
