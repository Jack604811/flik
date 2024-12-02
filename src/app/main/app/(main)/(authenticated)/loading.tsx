import Image from "next/image";
import { getCurrentWorkspace } from "@/server/actions/user.action";

export default async function Page() {
  // Fetch the workspace data once
  const workspace = await getCurrentWorkspace();

  // Handle the loading state if workspace data is not yet available
  if (!workspace) {
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

  // Determine the logo URL
  const logoUrl = workspace.logo || "/assets/logo.svg";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image
        src={logoUrl}
        alt="Workspace Logo"
        width={100}
        height={100}
        className="animate-pulse duration-700"
        unoptimized
      />
    </div>
  );
}

export function Loading() {
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
