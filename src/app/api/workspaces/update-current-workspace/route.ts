import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/auth';
import { updateCurrentWorkspace } from '@/server/actions/user.action';

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await req.json();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await updateCurrentWorkspace(currentUser.id, workspaceId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Failed to update workspace:', error);
    return NextResponse.json({ error: 'Failed to update workspace' }, { status: 500 });
  }
}
