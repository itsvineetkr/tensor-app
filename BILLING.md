# Billing Integration

This document outlines the Shopify billing integration implemented in the Tensor Search app.

## Features

### Free Plan
- **Cost**: $0/month
- **Features**: Full access to all Tensor Search functionality
- **Limitations**: None
- **Auto-enrollment**: All new installations are automatically enrolled in the Free Plan

## Technical Implementation

### Database Schema
- `BillingSubscription` model tracks billing status for each shop
- Stores plan information, subscription status, and trial data

### Billing Protection
- All main app routes are protected with billing checks
- API endpoints verify active billing before processing requests
- Automatic fallback to billing page for inactive subscriptions

### Webhook Integration
- Handles `APP_SUBSCRIPTIONS_UPDATE` and `APP_PURCHASES_ONE_TIME_UPDATE` webhooks
- Automatically updates billing status in database
- Maintains sync with Shopify's billing system

### User Interface
- Billing status indicator on main dashboard
- Dedicated billing page with subscription details
- Clear plan benefits and feature overview

## Files Modified/Added

1. **Database**:
   - `prisma/schema.prisma` - Added BillingSubscription model
   - Migration for billing table

2. **Server Logic**:
   - `app/shopify.server.js` - Added billing configuration and webhooks
   - `app/utils/billing.server.js` - Billing utility functions
   - `app/routes/webhooks.billing.jsx` - Webhook handler

3. **UI Components**:
   - `app/components/BillingCard.jsx` - Billing information display
   - `app/routes/app.billing.jsx` - Billing management page (fixed routing issue)

4. **Route Protection**:
   - Updated main app routes with billing checks
   - API routes protected with billing verification

## Usage

The billing system automatically:
1. Enrolls new shops in the Free Plan during installation
2. Protects app functionality with billing checks
3. Handles billing status updates via webhooks
4. Provides clear billing information to users

### Navigation
- **Dashboard** (`/app`) - Main setup and management interface
- **Help & Docs** (`/app/additional`) - Documentation and quick start guide
- **Billing** (`/app/billing`) - Comprehensive billing and plan information

### Billing Page Features
- Free Plan status banner
- Detailed billing information card
- Complete feature list and benefits
- Getting started guide
- Quick navigation back to dashboard

No additional configuration is required for the Free Plan implementation.
