"use client";
import { ClientSafeProvider, signIn } from "next-auth/react";
import Image from "next/image";
import { AFTER_SIGNIN_REDIRECT_URL, APP_DOMAIN } from "@/app-settings";
import { Button } from "@/components/ui/button";
export const OauthProvider = ({
  provider,
}: {
  provider: ClientSafeProvider;
}) => {
  return (
    <Button
      onClick={() => signIn(provider.id)}
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
        Sign in with <span className="capitalize">{provider.name}</span>
      </span>
    </Button>
  );
};
