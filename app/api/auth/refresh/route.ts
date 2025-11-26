// Refresh Token API Route
// POST /api/auth/refresh
// Refreshes JWT token if it's getting close to expiration

import { NextResponse } from 'next/server';
import {
  getAuthToken,
  refreshTokenIfNeeded,
  setAuthCookie,
  verifyToken,
  getTokenExpirationInfo,
} from '@/lib/auth';

export async function POST() {
  try {
    // Get current token
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Verify token is still valid
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get token expiration info
    const expirationInfo = getTokenExpirationInfo(token);

    // Try to refresh token
    const newToken = await refreshTokenIfNeeded(token);

    if (newToken) {
      // Token was refreshed
      await setAuthCookie(newToken);

      const newExpirationInfo = getTokenExpirationInfo(newToken);

      return NextResponse.json(
        {
          success: true,
          message: 'Token refreshed successfully',
          refreshed: true,
          user: {
            id: payload.userId,
            email: payload.email,
            name: payload.name,
            role: payload.role,
          },
          expiresAt: newExpirationInfo.expiresAt,
          minutesUntilExpiry: newExpirationInfo.minutesUntilExpiry,
        },
        { status: 200 }
      );
    } else {
      // Token doesn't need refresh yet
      return NextResponse.json(
        {
          success: true,
          message: 'Token is still valid',
          refreshed: false,
          user: {
            id: payload.userId,
            email: payload.email,
            name: payload.name,
            role: payload.role,
          },
          expiresAt: expirationInfo.expiresAt,
          minutesUntilExpiry: expirationInfo.minutesUntilExpiry,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check token status
export async function GET() {
  try {
    // Get current token
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: 'No token found' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get token expiration info
    const expirationInfo = getTokenExpirationInfo(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role,
        },
        expiresAt: expirationInfo.expiresAt,
        isExpired: expirationInfo.isExpired,
        minutesUntilExpiry: expirationInfo.minutesUntilExpiry,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Token status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
