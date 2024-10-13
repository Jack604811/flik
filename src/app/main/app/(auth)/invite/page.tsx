import { acceptWorkspaceInvite, checkIfInvitationExists } from "@/server/actions/workspace.action";
import { auth } from "@/server/auth";
import { notFound, redirect } from 'next/navigation';

export default async function Page({ searchParams }: { searchParams: { token: string } }) {
  const session = await auth()
  // Confirm if the token exists in the invitation table
  // If it does, show the page and let the user put in their information or sign in to the workspace
  // If it doesn't, show an 404 error page

  const invitation = await checkIfInvitationExists(searchParams.token??"");
  
  if (!invitation) {
    return notFound();
  }

  if(session?.user){
    // If the user is already signed in, accept the invitation and redirect to the dashboard
    await acceptWorkspaceInvite(invitation.token, session.user.id);
    return redirect(`/dashboard`);
  }

  return redirect(`/signup?invite=${searchParams.token}`);
}
