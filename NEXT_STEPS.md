# Next Steps to Complete Implementation

This guide outlines the remaining tasks to make the Homespun platform production-ready.

---

## 🔴 Critical (Complete Before Testing)

### 1. Add Razorpay Script to Checkout
The checkout page needs the Razorpay SDK loaded to process payments.

Add to `src/app/layout.tsx`:
```tsx
import Script from 'next/script'

// In the return, after Toaster:
<Script src="https://checkout.razorpay.com/v1/checkout.js" />
```

### 2. Run Database Migration
Once your database is running:
```bash
npx prisma migrate dev --name add_indexes_and_paid_at
npx prisma generate
```

### 3. Test Order Flow Complete
Test: Add to cart → Checkout → Payment → Order confirmation

---

## 🟡 High Priority

### 4. Rate Limiting
```bash
npm install @upstash/ratelimit @upstash/redis
```

### 5. Replace console.log
```bash
npm install pino pino-pretty
```

### 6. CSRF Protection
```bash
npm install csrf
```

### 7. Products from Database
Update `src/app/products/page.tsx` to fetch from Prisma

---

See IMPLEMENTATION_PROGRESS.md for full details.
