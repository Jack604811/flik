'use client' // Error components must be Client Components

import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

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