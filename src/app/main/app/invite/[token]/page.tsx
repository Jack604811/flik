import { checkIfInvitationExists } from "@/server/actions/workspace.action";
import { notFound, redirect } from 'next/navigation';

export default async function Page({ params }: { params: { token: string } }) {
  // Confirm if the token exists in the invitation table
  // If it does, show the page and let the user put in their information or sign in to the workspace
  // If it doesn't, show an 404 error page

  const invitation = await checkIfInvitationExists(params.token);
  
  if (!invitation) {
    return notFound();
  }

  return redirect(`/?type=invite&invite=${params.token}`);

  return (
    <div>
      Invite: {params.token}
    </div>
  );
}
