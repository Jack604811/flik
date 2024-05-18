import { authOptions } from "@/server/auth/options";
import { getServerSession } from "next-auth";
import { getPlanName } from "@/server/helpers/stripe/subscriptions/get-plan-name";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  // Layout already verified that the user has a subscription, so we can assume that the subscriptionId exists
  const subscriptionId = session?.user?.subscriptionId as string;

  const planName = await getPlanName({ subscriptionId });

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">Dashboard</h3>
        <div className="text-sm text-muted-foreground">
          <p>This is a protected page, only suscribed users can access it.</p>
          <p>You are subscribed to the {planName} plan </p>
        </div>
      </div>
    </div>
  );
}
