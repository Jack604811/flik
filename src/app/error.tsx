'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className='flex flex-col min-h-screen items-center justify-center'>
            <h2 className='text-6xl xl:text-[14rem] font-bold text-red-500'>Oops...</h2>
            <h2 className='mt-6 xl:mt-12 text-lg xl:text-xl'>Something went wrong!</h2>
            <Button
                className='mt-4'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </Button>
        </div>
    )
}