import { authOptions } from "@/server/auth/options";
import { getServerSession } from "next-auth";
import { getPlanName } from "@/server/helpers/stripe/subscriptions/get-plan-name";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);
    // Layout already verified that the user has a subscription, so we can assume that the subscriptionId exists
    const subscriptionId = session?.user?.subscriptionId as string;

    const planName = await getPlanName({ subscriptionId });

    return (
        <div className="min-h-screen flex justify-center items-center flex-col gap-2">
            <h1>Dashboard</h1>
            <p>This is a protected page, only suscribed users can access it.</p>
            <p>You are subscribed to the {planName} plan </p>

        </div>
    )
}