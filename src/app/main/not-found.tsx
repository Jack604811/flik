"use client";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
 
export default function NotFound() {
  const router = useRouter()
  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
            <h2 className='text-6xl xl:text-[14rem] font-bold text-red-500'>Oops...</h2>
            <h2 className='mt-6 xl:mt-12 text-lg xl:text-xl'>Could not find requested resource</h2>
            <Button
                className='mt-4'
                onClick={() => router.push('/')}>
                Go home
            </Button>
        </div>
  )
}