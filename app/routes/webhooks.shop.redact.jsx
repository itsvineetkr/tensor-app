import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);
  
  // Dynamic import to avoid client-side bundling issues
  const { default: db } = await import("../db.server");

  console.log(`Received ${topic} webhook for ${shop}`);

  // Handle shop data redaction for GDPR compliance
  // This webhook is triggered when a merchant uninstalls your app
  // You must delete all shop and customer data within 48 hours

  try {
    console.log('Processing shop data redaction:', {
      shop,
      shopId: payload.shop_id,
      shopDomain: payload.shop_domain,
      timestamp: new Date().toISOString(),
    });

    // Delete all shop-related data
    // This includes sessions, customer data, analytics, configurations, etc.
    
    // Delete sessions (already handled in app.uninstalled, but ensuring cleanup)
    await db.session.deleteMany({ where: { shop } });

    // Delete API keys for this shop
    await db.aPIKeys.deleteMany({ where: { shop_domain: shop } });

    // TODO: Delete all other shop-related data from your database
    // Example:
    // await db.shopConfiguration.deleteMany({ where: { shop } });
    // await db.customerData.deleteMany({ where: { shop } });
    // await db.analytics.deleteMany({ where: { shop } });

    // TODO: Remove shop data from external services
    // Example: Remove from analytics services, email lists, etc.

    console.log('Shop data redaction completed successfully');
  } catch (error) {
    console.error('Error processing shop data redaction:', error);
    // Still return 200 to acknowledge receipt
  }

  return new Response(null, { status: 200 });
};
