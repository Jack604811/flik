import { getCurrentUser } from "@/server/auth";

export default async function Dashboard() {
  const currentUser = await getCurrentUser()

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">Dashboard</h3>
          <h4 className="text-xl">Welcome back, {currentUser?.name}</h4>
        <div className="text-sm text-muted-foreground">
          <p>This is the dashboard where you see all the analytics of your spots</p>
        </div>
      </div>
    </div>
  );
}
