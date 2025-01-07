'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { validateVerificationCodeOTP, generateVerificationCodeOTP } from '@/server/actions/auth.action';
import { AFTER_VERIFY_REDIRECT_URL } from '@/app-settings';

export default function OTPVerification({ email }: { email: string }) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const BACK_BUTTON_URL = '/signup';

  // Start the countdown timer
  const startResendTimer = () => {
    setIsResendDisabled(true);
    setResendTimer(60); // 1 minute countdown
  };

  // Countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [resendTimer]);

  const handleVerify = async () => {
    if (value.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
  
    setIsVerifying(true);
    setError(null);
  
    try {
      const result = await validateVerificationCodeOTP(value);
  
      if (result.error) {
        throw new Error(result.error);
      }
  
      // Redirect to the dashboard after successful verification and login
      router.push(AFTER_VERIFY_REDIRECT_URL);
    } catch (err) {
      setError((err as Error).message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };
  

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);

    try {
      const result = await generateVerificationCodeOTP(email);

      if (result.success) {
        setError('A new code has been sent to your email.');
        startResendTimer(); // Start the timer after sending OTP
      } else {
        throw new Error('Failed to resend code.');
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-4">
      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Button size="sm" variant="outline" asChild>
          <Link href={BACK_BUTTON_URL}>
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-[400px] space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-left">Verify your email!</h1>
          <p className="text-muted-foreground text-sm">
            Please enter the 6-digit verification code sent to your email.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP
              value={value}
              onChange={setValue}
              maxLength={6}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>
        <Button
          className="w-full bg-black hover:bg-black/90 text-white"
          onClick={handleVerify}
          disabled={isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
        <Separator className="my-4" />
        <p className="text-muted-foreground text-center text-sm">
          Didn&apos;t receive the code?{' '}
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled || isResending}
            className="text-primary underline"
          >
            {isResending ? 'Sending email...' : isResendDisabled ? `Resend in ${resendTimer}s` : 'Resend'}
          </button>
        </p>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
      </div>
    </div>
  );
}
