npm run# Clerk Billing Setup Guide

## Why Clerk Billing is Better Than Direct Stripe

1. **Simplified Implementation**: Clerk handles all complex Stripe integration
2. **Built-in User Management**: Seamless integration with Clerk's auth system
3. **Reduced Maintenance**: No webhook management or subscription logic needed
4. **Better Security**: Clerk handles PCI compliance and sensitive payment data
5. **Faster Development**: Focus on core features instead of payment infrastructure

## Setup Steps

### 1. Configure Clerk Dashboard

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to **Billing** section
3. Connect your Stripe account
4. Create your products and pricing plans:
   - **Pro Plan**: $9.99/month
   - **Business Plan**: $29.99/month

### 2. Environment Variables

Add these to your `.env.local` file:

```bash
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Billing URLs (provided by Clerk dashboard)
NEXT_PUBLIC_CLERK_BILLING_PORTAL_URL=https://your-app.clerk.accounts.dev/billing
NEXT_PUBLIC_CLERK_PRO_CHECKOUT_URL=https://your-app.clerk.accounts.dev/billing/checkout/pro
NEXT_PUBLIC_CLERK_BUSINESS_CHECKOUT_URL=https://your-app.clerk.accounts.dev/billing/checkout/business
```

### 3. Remove Stripe Dependencies

You can now remove these packages:
```bash
npm uninstall @stripe/stripe-js stripe
```

And remove these environment variables:
```bash
# Remove these
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID
```

### 4. Update User Metadata

In your Clerk dashboard, configure user metadata to track subscription status:

```json
{
  "subscription_plan": "free|pro|business",
  "subscription_status": "active|inactive|cancelled",
  "subscription_end_date": "2024-12-31T23:59:59Z"
}
```

## How It Works

1. **User clicks upgrade** → Redirected to Clerk's hosted checkout
2. **Payment processed** → Clerk handles Stripe integration
3. **Subscription created** → Clerk updates user metadata
4. **User redirected back** → Your app reads subscription status from Clerk

## Benefits

- ✅ **No webhook management**
- ✅ **No customer creation logic**
- ✅ **No subscription state management**
- ✅ **Built-in fraud protection**
- ✅ **Automatic invoice generation**
- ✅ **Seamless user experience**

## Migration Complete!

Your app now uses Clerk's managed billing instead of direct Stripe integration. This is much cleaner, more secure, and easier to maintain.
