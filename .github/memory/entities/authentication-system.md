# Authentication System Entity

## Overview
JWT-based authentication system with Role-Based Access Control (RBAC) for the Thai Quotation & Receipt Generator application.

## Core Components

### 1. Database Schema
- **User Model**: Stores user accounts with authentication data
  - Fields: id, email, password (hashed), name, role, isActive, createdAt, updatedAt, lastLogin
  - Relations: One-to-many with Quotation, Receipt, Invoice (tracking creators)
- **UserRole Enum**: ADMIN, USER
- **Migration**: `20251109154605_add_user_authentication`

### 2. Authentication Library (`lib/auth.ts`)
- **Password Management**:
  - `hashPassword()`: Bcrypt with 10 rounds
  - `comparePassword()`: Secure verification
  - `validatePassword()`: Strength validation (8+ chars, uppercase, lowercase, number)
- **JWT Token Management**:
  - `signToken()`: Generate JWT (1-hour expiration)
  - `verifyToken()`: Verify and decode JWT
  - `decodeToken()`: Decode without verification
- **Cookie Management**:
  - `setAuthCookie()`: HttpOnly cookie (secure in production)
  - `getAuthToken()`: Retrieve token from cookie
  - `removeAuthCookie()`: Clear authentication
- **User Management**:
  - `getCurrentUser()`: Get authenticated user from token
  - `isAdmin()`: Role checking
  - `isAuthenticated()`: Auth status
  - `requireAuth()`: Middleware for protected routes
  - `requireAdmin()`: Middleware for admin-only routes
- **Validation**:
  - `validateEmail()`: Email format validation
  - `validatePassword()`: Password requirements validation

### 3. API Routes
- **POST `/api/auth/login`**: User login with email/password
- **POST `/api/auth/signup`**: Create user (admin only)
- **GET `/api/auth/me`**: Get current authenticated user
- **POST `/api/auth/logout`**: Logout and clear cookie

### 4. Frontend Components
- **Login Page** (`/login`): Email/password authentication form
- **Header Component**: User menu with dropdown, role display, logout
- **Auth Context** (`contexts/AuthContext.tsx`): Global auth state management
  - Hooks: `useAuth()`, `useIsAdmin()`, `useRequireAuth()`, `useRequireAdmin()`
- **User Creation Page** (`/admin/users/create`): Admin-only user management

### 5. User Roles
- **ADMIN**: Full access, can create users, manage all documents
- **USER**: Limited access, can manage own documents, cannot create users

## Security Features

### Password Security
- Bcrypt hashing with 10 rounds
- Minimum 8 characters
- Must contain: uppercase, lowercase, number
- Validation before storage

### Token Security
- JWT with 1-hour expiration
- Stored in httpOnly cookies (prevents XSS)
- Secure flag in production (HTTPS only)
- Server-side verification on every protected route

### Authorization
- Role-based access control (RBAC)
- Server-side role verification
- Protected routes require authentication
- Admin routes require ADMIN role

### Cookie Configuration
- Name: `auth_token`
- HttpOnly: true (not accessible via JavaScript)
- Secure: true in production
- SameSite: 'lax'
- Max-Age: 3600 seconds (1 hour)

## Environment Variables

```env
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Requirements**:
- Must be strong random string (32+ characters)
- Different for each environment (dev, staging, production)
- Never commit to version control

## Default Credentials

**Initial Admin User**:
- Email: `admin@example.com`
- Password: `Admin123!`
- Role: ADMIN
- Status: Active

⚠️ **CRITICAL**: Change password immediately in production!

## Implementation Status

✅ **Completed**:
- Database schema with User model
- Authentication utilities
- API routes (login, signup, me, logout)
- Frontend pages and components
- Auth context and hooks
- Build successful

⚠️ **Requires Manual Testing**:
- Login flow
- User creation (admin only)
- Logout functionality
- Role-based access control
- Protected routes
- Token expiration

## Dependencies

```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cookie": "^1.0.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/cookie": "^0.6.0"
  }
}
```

## Files Created/Modified

### New Files
- `lib/auth.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/signup/route.ts`
- `app/api/auth/me/route.ts`
- `app/api/auth/logout/route.ts`
- `app/login/page.tsx`
- `app/admin/users/create/page.tsx`
- `contexts/AuthContext.tsx`
- `components/Header.tsx`
- `docs/AUTH_SETUP.md`
- `AUTH_IMPLEMENTATION_COMPLETE.md`
- `QUICK-START-AUTH-TESTING.md`

### Modified Files
- `prisma/schema.prisma`: Added User model and relations
- `prisma/seed.ts`: Added initial admin user creation
- `app/layout.tsx`: Wrapped with AuthProvider
- `scripts/test-pdf-generation.ts`: Fixed TypeScript errors

## Usage Patterns

### Protecting API Routes
```typescript
import { requireAuth } from '@/lib/auth';

export async function GET() {
  const user = await requireAuth(); // Throws if not authenticated
  // ... protected logic
}
```

### Admin-Only Routes
```typescript
import { requireAdmin } from '@/lib/auth';

export async function POST() {
  const admin = await requireAdmin(); // Throws if not admin
  // ... admin-only logic
}
```

### Client-Side Auth
```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  // ... component logic
}
```

### Protected Pages
```typescript
'use client';
import { useRequireAuth } from '@/contexts/AuthContext';

export default function ProtectedPage() {
  const { user } = useRequireAuth(); // Auto-redirects if not authenticated
  // ... page logic
}
```

## Best Practices

### Password Management
- Always hash passwords before storage (bcrypt)
- Never log passwords (even hashed)
- Validate strength on client and server
- Force password change for default accounts

### Token Management
- Store in httpOnly cookies (not localStorage)
- Set short expiration times (1 hour)
- Verify on every protected route
- Clear on logout

### Error Handling
- Don't leak sensitive information in errors
- Use generic messages for authentication failures
- Log detailed errors server-side only
- Rate limit authentication endpoints (future enhancement)

### Production Considerations
1. Change default admin password
2. Use strong JWT_SECRET (32+ characters)
3. Enable HTTPS (secure cookies)
4. Set up rate limiting
5. Monitor authentication attempts
6. Implement audit logging
7. Regular security audits

## Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Create user as admin
- [ ] Attempt create user as regular user (should fail)
- [ ] Access protected route without auth (should redirect)
- [ ] Access admin route as user (should forbid)
- [ ] Logout clears session
- [ ] Token expiration after 1 hour
- [ ] Browser console has no errors
- [ ] API responses are correct

## Known Limitations

1. **Existing API Routes**: Not protected by default (optional implementation)
2. **Password Reset**: Not implemented (future enhancement)
3. **Email Verification**: Not implemented (future enhancement)
4. **2FA**: Not implemented (future enhancement)
5. **Rate Limiting**: Not implemented (future enhancement)
6. **Session Management**: Basic (cookie-based only)

## Future Enhancements

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting on auth endpoints
- [ ] Audit log for user actions
- [ ] Session management dashboard
- [ ] Remember me functionality
- [ ] OAuth integration (Google, GitHub)
- [ ] User management page (list, edit, disable)
- [ ] Profile page for password changes

## Related Entities

- **User Management System**: User CRUD operations
- **Role-Based Access Control**: Permission system
- **JWT Token System**: Token generation and verification
- **Cookie Management**: Secure cookie handling
- **Database Schema**: User and relations

## References

- Documentation: `docs/AUTH_SETUP.md`
- Implementation Summary: `AUTH_IMPLEMENTATION_COMPLETE.md`
- Testing Guide: `QUICK-START-AUTH-TESTING.md`
- Task File: `.github/tasks/task-2024-auth-implementation.md`

## Maintenance Notes

- JWT_SECRET should be rotated periodically
- Monitor for security vulnerabilities in dependencies
- Update bcrypt rounds as computing power increases
- Review and update password requirements as needed
- Keep authentication libraries up to date

---

**Created**: 2024-11-09
**Last Updated**: 2024-11-09
**Status**: Implemented, Build Successful, Manual Testing Required
**Version**: 2.0.0