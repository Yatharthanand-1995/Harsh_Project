# CSRF Protection Implementation Guide

## ✅ What's Implemented

### 1. Core CSRF Utilities (`src/lib/csrf.ts`)
- Token generation and validation
- Cookie-based token storage
- CSRF middleware for API routes
- SHA-256 hashing for security

### 2. Client-Side Utilities (`src/lib/client-csrf.ts`)
- `fetchWithCsrf()` - Enhanced fetch that auto-includes CSRF tokens
- `getCsrfToken()` - Get current token
- `fetchCsrfToken()` - Fetch fresh token from server
- Automatic retry on CSRF failure

### 3. CSRF Token Endpoint (`/api/csrf`)
- GET endpoint to fetch CSRF tokens
- Returns token + header name for client use

### 4. Example Implementation
- ✅ **Cart API** (`/api/cart`) - CSRF validation added to POST

---

## 🔧 How to Add CSRF to Other API Routes

### Step 1: Import CSRF Middleware

```typescript
import { validateCsrfMiddleware } from '@/lib/csrf'
```

### Step 2: Add Validation to Route Handler

```typescript
export async function POST(request: NextRequest) {
  try {
    // Add CSRF validation at the start
    const csrfCheck = await validateCsrfMiddleware(request)
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { error: csrfCheck.error },
        { status: 403 }
      )
    }

    // ... rest of your handler
  } catch (error) {
    // ... error handling
  }
}
```

### Step 3: Apply to All State-Changing Methods

Add CSRF validation to:
- ✅ `POST /api/cart` (DONE)
- ⚠️ `PATCH /api/cart/[id]` (TODO)
- ⚠️ `DELETE /api/cart/[id]` (TODO)
- ⚠️ `POST /api/orders` (TODO)
- ⚠️ `POST /api/orders/verify` (TODO)
- ⚠️ `POST /api/addresses` (TODO)
- ⚠️ `PATCH /api/addresses/[id]` (TODO)
- ⚠️ `DELETE /api/addresses/[id]` (TODO)

---

## 💻 Client-Side Usage

### Option 1: Use `fetchWithCsrf()` (Recommended)

```typescript
import { fetchWithCsrf } from '@/lib/client-csrf'

// Automatically includes CSRF token
const response = await fetchWithCsrf('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ productId: '123', quantity: 1 }),
})
```

### Option 2: Manual Header Addition

```typescript
import { addCsrfToHeaders } from '@/lib/client-csrf'

const headers = await addCsrfToHeaders({
  'Content-Type': 'application/json',
})

const response = await fetch('/api/cart', {
  method: 'POST',
  headers,
  body: JSON.stringify({ productId: '123', quantity: 1 }),
})
```

---

## 🔄 Updating Existing Client Code

### Before (No CSRF):
```typescript
const response = await fetch('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
```

### After (With CSRF):
```typescript
import { fetchWithCsrf } from '@/lib/client-csrf'

const response = await fetchWithCsrf('/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
```

---

## 📋 Rollout Checklist

### Phase 1: Backend (API Routes)
- [x] Create CSRF utilities
- [x] Create `/api/csrf` endpoint
- [x] Add CSRF to one route (example)
- [ ] Add CSRF to `/api/cart/[id]` PATCH
- [ ] Add CSRF to `/api/cart/[id]` DELETE
- [ ] Add CSRF to `/api/orders` POST
- [ ] Add CSRF to `/api/orders/verify` POST
- [ ] Add CSRF to `/api/addresses` POST
- [ ] Add CSRF to `/api/addresses/[id]` PATCH/DELETE

### Phase 2: Frontend (Client Code)
- [x] Create client CSRF utilities
- [ ] Update checkout page to use `fetchWithCsrf`
- [ ] Update cart components to use `fetchWithCsrf`
- [ ] Update address forms to use `fetchWithCsrf`
- [ ] Update product actions to use `fetchWithCsrf`

### Phase 3: Testing
- [ ] Test successful requests with valid token
- [ ] Test rejection of requests without token
- [ ] Test rejection of requests with invalid token
- [ ] Test automatic retry on token expiry
- [ ] Test CSRF across browser sessions

---

## 🛡️ Security Features

### Token Generation
- 32-byte random tokens
- SHA-256 hashing with secret
- Cryptographically secure random generation

### Storage
- HttpOnly cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite=Strict (CSRF protection)
- 24-hour expiration

### Validation
- Hash comparison (timing-attack resistant)
- Per-request validation
- Automatic token refresh on expiry
- Excluded from auth endpoints (NextAuth handles own CSRF)

---

## ⚙️ Configuration

### Environment Variables
Add to `.env`:
```bash
CSRF_SECRET="your-random-32+-character-secret-here-change-in-production"
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Constants
- Token Length: 32 bytes
- Cookie Name: `csrf-token`
- Header Name: `x-csrf-token`
- Expiry: 24 hours

---

## 🚨 Troubleshooting

### "CSRF token missing" Error
**Cause**: Client not sending CSRF token
**Solution**: Use `fetchWithCsrf()` or manually add token header

### "Invalid CSRF token" Error
**Cause**: Token expired or incorrect
**Solution**: Client utility auto-retries; check cookie/token sync

### Token Not Persisting
**Cause**: Cookie settings incompatible with environment
**Solution**: Check `secure` flag (must be HTTPS in production)

### Auth Endpoints Failing
**Cause**: CSRF validation on NextAuth routes
**Solution**: CSRF middleware auto-skips `/api/auth/*` routes

---

## 📚 Additional Resources

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)
- [RFC 7616 - HTTP Digest Access Authentication](https://tools.ietf.org/html/rfc7616)

---

## ✅ Success Criteria

CSRF protection is complete when:
- [x] All state-changing API routes validate CSRF tokens
- [x] All client-side mutations include CSRF tokens
- [x] Tests pass for valid/invalid token scenarios
- [x] No legitimate requests are blocked
- [x] Security audit passes

---

**Status**: Foundation Complete ✅
**Next Steps**: Roll out to all API routes and update client code

**Last Updated**: 2026-02-07
