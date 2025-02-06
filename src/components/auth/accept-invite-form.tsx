"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { updateOnboardingState } from "@/server/actions/auth.action";

interface AcceptInviteFormProps {
  token: string;
  userId: string;
  acceptWorkspaceInvite: (token: string, userId: string) => Promise<any>;
}

export function AcceptInviteForm({ token, userId, acceptWorkspaceInvite }: AcceptInviteFormProps) {
  const router = useRouter();
  const { update, data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await acceptWorkspaceInvite(token, userId)
      if(!session?.user.onboardingComplete){
        await updateOnboardingState()
        await update({
        user: {
            onboardingComplete: new Date()
        }})
      }
      router.replace('/dashboard');
    } catch (error) {
      console.error('Failed to accept invite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAccept}
      disabled={isLoading}
      size="lg"
      className="w-full max-w-sm mt-4 font-semibold"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Accepting Invite...
        </>
      ) : (
        'Accept Invite'
      )}
    </Button>
  );
}