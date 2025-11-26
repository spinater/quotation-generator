// Logout API Route
// POST /api/auth/logout
// Clears authentication cookie and logs out user

import { NextResponse } from 'next/server';
import { removeAuthCookie, getCurrentUser } from '@/lib/auth';

export async function POST() {
  try {
    // Get current user (optional - for logging purposes)
    const user = await getCurrentUser();

    if (user) {
      console.log(`User ${user.email} logged out`);
    }

    // Remove authentication cookie
    await removeAuthCookie();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Logged out successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Logout error:', error);

    // Even if there's an error, try to remove cookie
    try {
      await removeAuthCookie();
    } catch (e) {
      console.error('Failed to remove cookie:', e);
    }

    return NextResponse.json(
      { error: 'Logout failed, but cookie cleared' },
      { status: 500 }
    );
  }
}
