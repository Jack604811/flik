/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";


export default function NotFound() {
    return (
        <div className='flex flex-col min-h-screen items-center justify-center'>
            <h2 className='text-6xl xl:text-[14rem] font-bold'>Oops...</h2>
            <h2 className='mt-6 xl:mt-16 text-lg xl:text-xl'>Invitation link does not exist</h2>
            <p>The team invitation has either expired or doesn't exist. Request a new link from the team owner or check the URL to make sure it is entered correctly.</p>
        </div>
    )
}