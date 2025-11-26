# 🧪 Quick Test Guide: Authentication Updates

## 🎯 3-Minute Quick Test

Follow these steps to verify all updates work correctly.

---

## Step 1: Start Server (30 seconds)

```bash
cd quotation-generator
rm -rf .next  # Clear cache
npm run dev
```

Wait for: `✓ Ready in 2.5s`

---

## Step 2: Test Login Button Fix (1 minute)

### Before Login
1. Open http://localhost:4000
2. **VERIFY**: "Login" button visible in top-right
3. **VERIFY**: No user menu

### After Login
1. Click "Login" button
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `Admin123!`
3. **CLICK** "Sign In" button
4. **VERIFY**:
   - ✅ Redirect to home page
   - ✅ User menu appears (circular avatar)
   - ✅ Shows "System Administrator"
   - ✅ Login button is GONE
   - ✅ No errors in console (F12)

**❌ If login button still shows**: Hard refresh (Ctrl+Shift+R)

---

## Step 3: Test Middleware (1 minute)

### Test 1: Unauthenticated Access
1. Open incognito window
2. Type: http://localhost:4000/admin/users/create
3. **VERIFY**:
   - ✅ Redirects to `/login`
   - ✅ URL shows `?redirect=/admin/users/create`
   - ✅ Cannot access admin page

### Test 2: Admin Access
1. Login as admin (from Step 2)
2. Click user menu → "Create User"
3. **VERIFY**:
   - ✅ Page loads successfully
   - ✅ Form appears
   - ✅ No redirect

### Test 3: User Role Access (Optional)
1. Create a USER account
2. Logout and login as USER
3. Try accessing `/admin/users/create`
4. **VERIFY**:
   - ✅ Redirects to home page (forbidden)

---

## Step 4: Test Token Refresh (30 seconds)

### Quick Test
1. Login as admin
2. Open browser console (F12)
3. Type:
   ```javascript
   fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
     .then(r => r.json())
     .then(d => console.log(d))
   ```
4. **VERIFY** response shows:
   ```json
   {
     "success": true,
     "message": "Token is still valid",
     "minutesUntilExpiry": 60
   }
   ```

### Check Token Status
1. Type in console:
   ```javascript
   fetch('/api/auth/refresh', { credentials: 'include' })
     .then(r => r.json())
     .then(d => console.log('Token expires in:', d.minutesUntilExpiry, 'minutes'))
   ```
2. **VERIFY**: Shows time until expiration

### Trigger Auto-Refresh
1. Stay logged in
2. Move mouse around for a few seconds
3. Check console for:
   ```
   ✅ Token refreshed in background
   ```
   OR
   ```
   Token refreshed successfully
   ```

---

## ✅ Success Criteria

If ALL these work, updates are successful:

- [x] Login button changes to user menu after login
- [x] Unauthenticated users redirected to login
- [x] Admin pages protected by middleware
- [x] Token refresh API works
- [x] Token status check works
- [x] No errors in browser console
- [x] Build succeeds: `npm run build`

---

## 🔍 Visual Checklist

### What You Should See:

**Before Login:**
- "Login" button in header (top-right)

**After Login:**
- Circular avatar with first letter of name
- User name below avatar
- Role badge (👑 Admin or 👤 User)
- Dropdown arrow

**User Menu Dropdown:**
- User info at top
- "Create User" (admin only)
- Profile, Settings links
- Red logout button

**Protected Routes:**
- `/admin/*` - Requires login + admin role
- `/settings/*` - Requires login
- `/profile/*` - Requires login

---

## 🐛 Troubleshooting

### Login button still showing after login
```bash
# Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Clear cache
rm -rf .next
npm run dev
```

### Middleware not working
```bash
# Reinstall dependencies
npm install jose

# Clear and rebuild
rm -rf .next
npm run build
npm run dev
```

### Token refresh errors
- Check JWT_SECRET is set in .env
- Check browser console for errors
- Verify you're logged in
- Try manual refresh: `POST /api/auth/refresh`

---

## 📊 Console Commands for Testing

```javascript
// Check if logged in
fetch('/api/auth/me', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log('Current user:', d.user))

// Check token status
fetch('/api/auth/refresh', { credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log('Token expires in:', d.minutesUntilExpiry, 'min'))

// Force token refresh
fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
  .then(r => r.json())
  .then(d => console.log('Refreshed:', d.refreshed))

// Logout
fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  .then(() => console.log('Logged out'))
```

---

## 🎬 Advanced Testing (Optional)

### Test Automatic Refresh on Activity

1. Login
2. Open console
3. Wait 10 minutes (middleware auto-refresh interval)
4. Move mouse or click something
5. **VERIFY**: Console shows token refresh message

### Test Token Expiration

1. Login
2. Wait 1 hour without any activity
3. Try to access a protected page
4. **VERIFY**: Redirects to login (token expired)

### Test API Client Auto-Refresh

1. Create a test file:
```javascript
import { apiGet } from '@/lib/api-client';

// This will auto-refresh token
const data = await apiGet('/api/quotations');
console.log('Data:', data);
```

2. **VERIFY**: Token refreshes in background

---

## 📝 Expected Console Messages

During normal use, you should see:

```
✅ Token refreshed successfully
Token expires in 45 minutes
Background token refresh
Login successful: { id: "...", email: "..." }
User activity detected - refreshing token
```

You should NOT see:
```
❌ JWT verification failed
❌ Token refresh failed
❌ Unauthorized
❌ Cannot read property of undefined
```

---

## 🚀 All Tests Pass?

If all tests above pass:

1. ✅ Mark task as complete
2. ✅ Commit changes
3. ✅ Deploy to staging/production
4. ✅ Update documentation

If any test fails:
1. Check browser console (F12)
2. Check server logs in terminal
3. Follow troubleshooting steps above
4. Review AUTH_UPDATES_COMPLETE.md

---

## 📞 Quick Reference

| Feature | Endpoint | Method |
|---------|----------|--------|
| Login | `/api/auth/login` | POST |
| Logout | `/api/auth/logout` | POST |
| Current User | `/api/auth/me` | GET |
| Refresh Token | `/api/auth/refresh` | POST |
| Token Status | `/api/auth/refresh` | GET |

| Route | Protection |
|-------|------------|
| `/admin/*` | Admin only |
| `/settings/*` | Auth required |
| `/profile/*` | Auth required |
| `/login` | Public |

---

**Testing Time**: ~3 minutes
**Status**: All features implemented
**Next**: Manual testing required

**Remember**: "If you didn't CLICK it, it doesn't work!" 🖱️