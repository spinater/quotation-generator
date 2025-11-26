// Authentication Utilities
// Handles JWT token generation/verification and password hashing

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '1h'; // 1 hour as per requirements
const JWT_EXPIRES_IN_SECONDS = 60 * 60; // 1 hour in seconds
const REFRESH_THRESHOLD = 15 * 60; // Refresh if token expires in less than 15 minutes

// Cookie Configuration
const TOKEN_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60; // 1 hour in seconds

// Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
  name: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

// Password Utilities
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

// JWT Utilities
export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Sign token using jose (for edge runtime compatibility)
export const signTokenJose = async (payload: JWTPayload): Promise<string> => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${JWT_EXPIRES_IN_SECONDS}s`)
    .sign(secret);
  return token;
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

// Verify token using jose (for edge runtime compatibility)
export const verifyTokenJose = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

// Check if token needs refresh (expires in less than 15 minutes)
export const shouldRefreshToken = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return false;

    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;

    return timeUntilExpiry < (REFRESH_THRESHOLD * 1000);
  } catch (error) {
    console.error('Token refresh check failed:', error);
    return false;
  }
};

// Refresh token if needed
export const refreshTokenIfNeeded = async (token: string): Promise<string | null> => {
  try {
    // Verify token is still valid
    const payload = verifyToken(token);
    if (!payload) return null;

    // Check if refresh is needed
    if (!shouldRefreshToken(token)) {
      return null; // Token doesn't need refresh yet
    }

    // Generate new token with same payload
    const newToken = signToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    });

    return newToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
};

// Cookie Utilities (Server-side)
export const setAuthCookie = async (token: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
};

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE_NAME);
  return token?.value || null;
};

export const removeAuthCookie = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
};

// Get Current User from Token (with auto-refresh)
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    // Auto-refresh token if needed
    const newToken = await refreshTokenIfNeeded(token);
    if (newToken) {
      await setAuthCookie(newToken);
      console.log('Token auto-refreshed for user:', payload.email);
    }

    return {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch (error) {
    console.error('Get current user failed:', error);
    return null;
  }
};

// Authorization Checks
export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
};

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

// Middleware Helper: Require Authentication
export const requireAuth = async (): Promise<AuthUser> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return user;
};

// Middleware Helper: Require Admin Role
export const requireAdmin = async (): Promise<AuthUser> => {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('Forbidden: Admin access required');
  }
  return user;
};

// Validate Password Strength
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

// Validate Email Format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Get token expiration info
export const getTokenExpirationInfo = (token: string): {
  expiresAt: Date | null;
  isExpired: boolean;
  minutesUntilExpiry: number | null;
} => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) {
      return { expiresAt: null, isExpired: true, minutesUntilExpiry: null };
    }

    const expiresAt = new Date(decoded.exp * 1000);
    const now = Date.now();
    const timeUntilExpiry = decoded.exp * 1000 - now;
    const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));

    return {
      expiresAt,
      isExpired: timeUntilExpiry <= 0,
      minutesUntilExpiry: minutesUntilExpiry > 0 ? minutesUntilExpiry : 0,
    };
  } catch (error) {
    console.error('Get token expiration failed:', error);
    return { expiresAt: null, isExpired: true, minutesUntilExpiry: null };
  }
};
