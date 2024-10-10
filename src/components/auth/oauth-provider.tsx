"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Provider } from "next-auth/providers/index";

export const OauthProvider = ({
  provider,
  callbackUrl,
  prefix
}: {
  prefix: string;
  callbackUrl: string;
  provider: Provider;
}) => {
  return (
    <Button
      onClick={() => signIn(provider.name, { callbackUrl })}
      className="flex gap-2 items-center justify-center w-full "
      variant={"secondary"}
    >
      <Image
        alt=""
        src={`/assets/icons/nextauth-providers/${provider.name.toLowerCase()}.svg`}
        width={20}
        height={20}
      />
      <span>
        {prefix} with <span className="capitalize">{provider.name}</span>
      </span>
    </Button>
  );
};
