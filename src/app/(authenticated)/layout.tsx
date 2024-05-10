import { NON_AUTHENTICATED_REDIRECT_URL } from "@/app_settings";
import { authOptions } from "@/server/auth/options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

/** This layout makes sure all routes inside the authenticated are protected against non authenticated users   */

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return redirect(NON_AUTHENTICATED_REDIRECT_URL)
    }

    if (session.user) {
        return children
    }

    return null;

}