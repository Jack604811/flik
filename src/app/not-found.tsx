import Link from "next/link";


export default function NotFound() {
    return (
        <div className='flex flex-col min-h-screen items-center justify-center'>
            <h2 className='text-6xl xl:text-[14rem] font-bold'>Oops...</h2>
            <h2 className='mt-6 xl:mt-16 text-lg xl:text-xl'>We could not find what you were looking for...</h2>
            <Link
                href={'/'}
                className='mt-4 bg-accent text-accent-foreground px-6 py-3 rounded'

            >
                Return Home
            </Link>
        </div>
    )
}