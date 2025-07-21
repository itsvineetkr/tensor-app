# Privacy Webhooks Implementation

This document explains the mandatory privacy webhooks implemented for GDPR and CCPA compliance in your Shopify app.

## 🔒 Mandatory Webhooks

Your app now handles the following required privacy webhooks:

### 1. `customers/data_request`
- **File**: `app/routes/webhooks.customers.data_request.jsx`
- **Purpose**: Handle customer requests for their personal data (GDPR Article 15)
- **Required Action**: Collect and provide customer data within 30 days

### 2. `customers/redact`
- **File**: `app/routes/webhooks.customers.redact.jsx`
- **Purpose**: Handle customer requests to delete their personal data (GDPR Article 17)
- **Required Action**: Delete all customer data immediately

### 3. `shop/redact`
- **File**: `app/routes/webhooks.shop.redact.jsx`
- **Purpose**: Handle shop data deletion when merchant uninstalls your app
- **Required Action**: Delete all shop and customer data within 48 hours

## 📝 Configuration

The webhooks are configured in `shopify.app.toml`:

```toml
[[webhooks.subscriptions]]
topics = [ "customers/data_request" ]
uri = "/webhooks/customers/data_request"

[[webhooks.subscriptions]]
topics = [ "customers/redact" ]
uri = "/webhooks/customers/redact"

[[webhooks.subscriptions]]
topics = [ "shop/redact" ]
uri = "/webhooks/shop/redact"
```

## 🛠️ Testing

To test your privacy webhooks:

1. **Deploy your app**:
   ```bash
   npm run deploy
   ```

2. **Test with Shopify CLI**:
   ```bash
   shopify app generate webhook --topic=CUSTOMERS_DATA_REQUEST
   shopify app generate webhook --topic=CUSTOMERS_REDACT
   shopify app generate webhook --topic=SHOP_REDACT
   ```

3. **Run the test script**:
   ```bash
   node test-privacy-webhooks.js
   ```

## ⚠️ Important Implementation Notes

### Data Collection (`customers/data_request`)
- Log all data requests for compliance tracking
- Collect customer data from your database
- Return data in a structured format (JSON/CSV)
- Notify customer when data is ready (email/API)

### Data Deletion (`customers/redact`)
- Delete customer data immediately upon request
- Remove from all systems (database, cache, external services)
- Log deletion for compliance tracking
- Ensure data is permanently deleted (not just marked as deleted)

### Shop Data Deletion (`shop/redact`)
- Triggered when merchant uninstalls your app
- Must delete ALL shop and customer data within 48 hours
- Includes: sessions, customer data, configurations, API keys
- Remove from external services (analytics, email lists, etc.)

## 🔧 Customization Required

Update the webhook handlers in each file to:

1. **Replace TODO comments** with actual data handling logic
2. **Implement database queries** for your specific data models
3. **Add external service cleanup** (if you use third-party services)
4. **Implement data export functionality** for data requests

### Example Database Cleanup (in each webhook):
```javascript
// Example: Delete customer-specific data
await db.customerPreferences.deleteMany({ 
  where: { customerId: customerId.toString(), shop } 
});

await db.customerAnalytics.deleteMany({ 
  where: { customerId: customerId.toString(), shop } 
});
```

## 📋 Compliance Checklist

- [x] Privacy webhooks implemented
- [x] Webhook endpoints configured in TOML
- [x] Basic logging and error handling
- [ ] Implement actual data collection logic
- [ ] Implement actual data deletion logic
- [ ] Add external service cleanup
- [ ] Test webhook functionality
- [ ] Document data retention policies
- [ ] Review with legal/compliance team

## 🚀 Next Steps

1. **Customize the webhook handlers** with your specific data models
2. **Test thoroughly** in development environment
3. **Deploy to production** with proper monitoring
4. **Document your data handling policies** for customers
5. **Regular compliance audits** to ensure proper data handling

Remember: These webhooks are **mandatory** for Shopify app approval and legal compliance in regions with data protection laws (GDPR, CCPA, etc.).
