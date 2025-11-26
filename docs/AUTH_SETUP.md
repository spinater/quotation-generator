# Authentication Setup Guide

## Overview

This application now includes JWT-based authentication with Role-Based Access Control (RBAC).

## Features

- **JWT Authentication**: Secure token-based authentication with 1-hour expiration
- **RBAC**: Two roles - ADMIN and USER
- **Password Security**: Bcrypt hashing with 10 rounds
- **HttpOnly Cookies**: Secure token storage (not accessible via JavaScript)
- **Admin-Only User Creation**: Only admins can create new users

## Environment Variables

Add the following to your `.env` file:

```env
# Existing variables
DATABASE_URL="postgresql://user:password@localhost:5432/quotation_db?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:4000"

# NEW: Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Important**: 
- Generate a strong random secret for `JWT_SECRET` in production
- Never commit `.env` file to version control
- Use a different secret for each environment (dev, staging, production)

## Database Migration

Run the following commands to update your database schema:

```bash
# Generate Prisma client with new User model
npm run prisma:generate

# Create and apply migration
npx prisma migrate dev --name add_user_authentication

# Seed database with initial admin user
npm run prisma:seed
```

## Initial Admin User

The seed script will create a default admin user:

**Email**: `admin@example.com`  
**Password**: `Admin123!`  
**Role**: ADMIN

**⚠️ IMPORTANT**: Change the password immediately after first login in production!

## User Roles

### ADMIN Role
- Full access to all features
- Can create new users (both ADMIN and USER roles)
- Can manage all quotations, receipts, and invoices
- Can manage company settings

### USER Role
- Can create and manage own documents
- Can view company information
- Cannot create new users
- Limited administrative access

## API Endpoints

### Authentication Routes

#### POST `/api/auth/login`
Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  },
  "token": "jwt-token"
}
```

#### POST `/api/auth/signup` (Admin Only)
Create a new user. Requires admin authentication.

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "New User",
  "role": "USER"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "newuser@example.com",
    "name": "New User",
    "role": "USER"
  }
}
```

#### GET `/api/auth/me`
Get current logged-in user information.

**Response** (200 OK):
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER"
  }
}
```

#### POST `/api/auth/logout`
Logout current user (clears auth cookie).

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Protected Routes

All API routes except `/api/auth/*` now require authentication.

### Example: Protected Route Implementation

```typescript
// app/api/quotations/route.ts
import { requireAuth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Require authentication
    const user = await requireAuth();
    
    // User is authenticated, proceed with logic
    // ...
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
```

### Example: Admin-Only Route

```typescript
// app/api/users/route.ts
import { requireAdmin } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Require admin role
    const admin = await requireAdmin();
    
    // Admin authenticated, proceed with user creation
    // ...
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message.includes('Forbidden') ? 403 : 401 }
    );
  }
}
```

## Frontend Integration

### Login Page

Located at `/login` - Users can authenticate here.

### Auth Context

Use the auth context to access current user:

```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isLoading, logout } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return (
    <div>
      <p>Welcome, {user.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

Example valid passwords:
- `Admin123!`
- `Password1`
- `SecureP@ss1`

## Security Best Practices

1. **JWT Secret**: Use a strong, random secret in production (minimum 32 characters)
2. **HTTPS**: Always use HTTPS in production to protect tokens in transit
3. **Password Policy**: Enforce strong passwords (already implemented)
4. **Token Expiry**: Tokens expire after 1 hour - users must re-login
5. **HttpOnly Cookies**: Tokens stored in httpOnly cookies prevent XSS attacks
6. **Password Hashing**: Bcrypt with 10 rounds provides strong protection
7. **Role Verification**: Always verify user role on backend, never trust frontend

## Testing Authentication

### Manual Testing Steps

1. **Start the application**:
   ```bash
   npm run dev
   ```

2. **Login as admin**:
   - Navigate to http://localhost:4000/login
   - Email: `admin@example.com`
   - Password: `Admin123!`

3. **Test protected routes**:
   - Try accessing `/api/quotations` without login (should fail)
   - Login and access again (should succeed)

4. **Test admin-only features**:
   - Login as admin
   - Navigate to user creation page
   - Create a new user

5. **Test regular user**:
   - Logout
   - Login with created user
   - Try to access user creation (should fail)

## Troubleshooting

### "Unauthorized" Error
- Check if you're logged in
- Check if token has expired (1 hour)
- Clear cookies and login again

### "Forbidden" Error
- You don't have permission for this action
- Admin role required
- Contact an administrator

### Login Not Working
- Check email and password
- Check database connection
- Verify user exists in database
- Check if user is active (`isActive = true`)

### Token Issues
- Clear browser cookies
- Check `JWT_SECRET` is set in `.env`
- Verify token hasn't expired
- Check server logs for JWT errors

## Migration from Unauthenticated Version

If you have existing data:

1. Run migration to add User model
2. Seed database to create admin user
3. All existing documents will continue to work
4. `createdById` fields are optional (can be null)
5. Update API clients to include authentication

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting on auth endpoints
- [ ] Audit log for user actions
- [ ] Session management dashboard
- [ ] Remember me functionality
- [ ] OAuth integration (Google, GitHub, etc.)

## Support

For issues or questions about authentication:
1. Check this documentation
2. Review error messages in browser console
3. Check server logs for detailed errors
4. Verify environment variables are set correctly