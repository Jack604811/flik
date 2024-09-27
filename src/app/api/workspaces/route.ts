import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { db } from '@/server/db';

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Fetch the workspaces owned by the current user
  const workspaces = await db.workspace.findMany({
    where: { ownerId: currentUser.id },
    select: { id: true, siteName: true },
  });

  // Fetch the user's currentWorkspaceId
  const user = await db.user.findFirst({
    where: { id: currentUser.id },
    select: { currentWorkspaceId: true },
  });

  return NextResponse.json({
    workspaces,
    currentWorkspaceId: user?.currentWorkspaceId || null,
  });
}
