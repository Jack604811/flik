import Image from "next/image";
import { acceptWorkspaceInvite, checkIfInvitationExists } from "@/server/actions/workspace.action";
import { auth } from "@/server/auth";
import { notFound, redirect } from 'next/navigation';
import { AcceptInviteForm } from "@/components/auth/accept-invite-form";

export default async function Page({ searchParams }: { searchParams: { invite: string } }) {
  const session = await auth()
  // Confirm if the token exists in the invitation table
  // If it does, show the page and let the user put in their information or sign in to the workspace
  // If it doesn't, show an 404 error page

  const invitation = await checkIfInvitationExists(searchParams.invite??"");
  
  if (!invitation) {
    return notFound();
  }
  if(!session?.user){
    return redirect(`/signup?invite=${searchParams.invite}`);
  }

// Accept invite page, should have an accept button
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
        <Image
          className="mx-auto h-12 w-auto"
          src={invitation?.teamMember.workspace.logo ?? "/assets/placeholder.svg"}
          alt={invitation?.teamMember.workspace.siteName ?? ""}
          width={48} 
          height={48} 
          priority 
        />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accept Invite to Workspace: {invitation?.teamMember.workspace.siteName}
          </h2>
          <div className="mt-6 flex justify-center">
            <AcceptInviteForm 
              token={invitation.token}
              userId={session.user.id}
              acceptWorkspaceInvite={acceptWorkspaceInvite}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
