import Image from "next/image";

export default function Loading(): JSX.Element {
    return (
    <div className="flex flex-col items-center justify-center h-screen">
        <Image 
        src="/assets/logo.svg"
        alt="Loading..."
         width={100} 
         height={100} 
         className= "animate-pulse duration-700"
         />
    </div>
    );
};