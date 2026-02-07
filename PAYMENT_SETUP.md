# UPI Payment Setup Guide

This guide will help you set up UPI payments for your Homespun e-commerce store.

## Quick Setup (3 Steps)

### 1. Update Your UPI Details

Edit the file: `src/lib/payment-config.ts`

```typescript
export const PAYMENT_CONFIG = {
  UPI_ID: 'your-actual-upi-id@paytm', // ← Change this to your UPI ID
  BUSINESS_NAME: 'Your Business Name',  // ← Change this to your business name
  // ... rest of the config
}
```

**Where to find your UPI ID:**
- Open your UPI app (Google Pay, PhonePe, Paytm, etc.)
- Go to Profile or Settings
- Look for "Your UPI ID" or "UPI ID"
- It will look like: `yourname@paytm`, `yourname@ybl`, etc.

### 2. Add Your UPI QR Code (Optional but Recommended)

**Generate your UPI QR code:**

**Option A: Use your UPI app**
1. Open Google Pay / PhonePe / Paytm
2. Tap on your profile picture
3. Tap "QR code" or "My QR code"
4. Take a screenshot of the QR code
5. Crop the image to just the QR code

**Option B: Generate online**
1. Go to https://www.qr-code-generator.com/solutions/upi-qr-code/
2. Enter your UPI ID
3. Download the QR code

**Add the QR code to your project:**
1. Save your QR code image as `upi-qr.png`
2. Place it in the `public/` folder of your project
3. Path: `public/upi-qr.png`

**If you don't want to show QR code:**
Edit `src/lib/payment-config.ts`:
```typescript
SHOW_QR_CODE: false, // Set to false to hide QR code
```

### 3. Configure Payment Options (Optional)

In `src/lib/payment-config.ts`, you can customize:

```typescript
// Allow customers to pay later (order created, payment pending)
ALLOW_PAY_LATER: true, // Set to false to require immediate payment

// Customize payment instructions
PAYMENT_INSTRUCTIONS: [
  'Your custom instruction 1',
  'Your custom instruction 2',
  // ...
],
```

## How It Works

### Customer Flow:
1. Customer adds items to cart and proceeds to checkout
2. Customer enters delivery address and details
3. Customer clicks "Place Order"
4. Order is created with status "PENDING"
5. Payment modal shows:
   - QR code to scan
   - UPI ID to copy
   - Field to enter UPI Transaction ID
6. Customer pays via any UPI app
7. Customer enters the 12-digit UPI Transaction ID
8. Order is marked as "AWAITING VERIFICATION"
9. Cart is cleared

### Admin Flow:
1. Admin receives order with UPI Transaction ID
2. Admin verifies the payment in their UPI app
3. Admin marks order as "PAID" and "CONFIRMED" (manual process)
4. Order is processed and shipped

## Testing

### Test the payment flow:
1. Add a product to cart
2. Go through checkout
3. Enter a test UPI Transaction ID (12 digits): `123456789012`
4. Check your orders page

### Verify configuration:
- The payment modal should show your UPI ID
- If QR code is added, it should display correctly
- Instructions should match your requirements

## Environment Variables

No environment variables needed! This is a simple direct UPI payment system.

Unlike Razorpay or other payment gateways, this approach:
- ✅ No API keys required
- ✅ No monthly fees
- ✅ No transaction fees
- ✅ Direct to your UPI account
- ✅ Works with any UPI app
- ❌ Manual payment verification required
- ❌ No automatic payment confirmation

## Security Notes

- UPI Transaction IDs are checked for duplicates
- Only authenticated users can submit payments
- CSRF protection is enabled
- Order-User relationship is verified
- Transaction IDs are logged for audit trail

## Upgrading to Automatic Payment Gateway (Future)

If you want to upgrade to automatic payment verification later:
- Razorpay (India): 2% transaction fee
- Stripe (International): 2.9% + 30¢
- Instamojo (India): 2% + ₹3
- PayU (India): 2-3%

This manual UPI system is perfect for:
- Small businesses starting out
- Low-volume stores (< 50 orders/day)
- Testing your store before investing in payment gateway
- Saving on transaction fees

## Support

For issues or questions:
1. Check that `src/lib/payment-config.ts` is updated correctly
2. Verify QR code is at `public/upi-qr.png`
3. Test with a dummy transaction ID
4. Check browser console for errors

---

**That's it!** Your store now accepts UPI payments. 🎉
