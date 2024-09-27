// app/api/workspace/get-current-workspace/route.ts
import { NextResponse } from 'next/server';
import { getCurrentWorkspace } from '@/server/actions/user.action';

export async function GET() {
  try {
    const currentWorkspace = await getCurrentWorkspace();

    // Ensure the data is serializable
    const serializedWorkspace = currentWorkspace
      ? JSON.parse(JSON.stringify(currentWorkspace))
      : null;

    return NextResponse.json({ currentWorkspace: serializedWorkspace });
  } catch (error) {
    console.error('Error fetching currentWorkspace:', error);
    return NextResponse.json(
      { error: 'Failed to fetch current workspace' },
      { status: 500 }
    );
  }
}
