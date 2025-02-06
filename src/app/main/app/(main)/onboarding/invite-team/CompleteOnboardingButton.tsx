"use client";
import { Button } from '@/components/ui/button';
import { updateOnboardingState } from '@/server/actions/auth.action';
import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function CompleteOnboardingButton() {
    const { update } = useSession()
    const { refresh } = useRouter()
    const { mutate, isPending } = useMutation({
        mutationKey: ["updateOnboardingState"],
        mutationFn: async () => {
            await updateOnboardingState().then((res) => {
                update({
                    user: {
                        ...res
                    }
                }).then(refresh)
            });
        }
    });
  return (
    <Button disabled={isPending} onClick={() => mutate()}>Complete Onboarding</Button>
  )
}
