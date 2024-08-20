import Image from "next/image";
import { getCurrentUser } from "@/server/auth";
import { getUser } from "@/server/actions/user.action";

export default async function Page() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <Image 
                    src="/assets/logo.svg"
                    alt="Loading..."
                    width={100} 
                    height={100} 
                    className="animate-pulse duration-700"
                />
            </div>
        );
    }

    const user = await getUser(currentUser.id);

    const logoUrl = user?.logo ? user.logo : "/assets/logo.svg";

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <Image 
                src={`${logoUrl}?${Date.now()}`}
                alt="Loading..."
                width={100} 
                height={100} 
                className= "animate-pulse duration-700"
                unoptimized
            />
        </div>
    );
};

export function Loading(): JSX.Element {
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
