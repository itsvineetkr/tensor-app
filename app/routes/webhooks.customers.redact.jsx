import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Handle customer data redaction for GDPR compliance
  // This webhook is triggered when a customer requests deletion of their personal data
  // You must delete all personal data related to this customer

  try {
    const customerId = payload.customer?.id;
    
    if (!customerId) {
      console.warn('No customer ID provided in redaction request');
      return new Response(null, { status: 200 });
    }

    console.log('Processing customer data redaction:', {
      shop,
      customerId,
      timestamp: new Date().toISOString(),
    });

    // TODO: Delete customer data from your database
    // Example implementation:
    // await db.customerData.deleteMany({
    //   where: { customerId: customerId.toString(), shop }
    // });
    
    // await db.customerAnalytics.deleteMany({
    //   where: { customerId: customerId.toString(), shop }
    // });

    // TODO: Remove customer data from any external services
    // Example: Remove from email marketing lists, analytics services, etc.

    console.log('Customer data redaction completed successfully');
  } catch (error) {
    console.error('Error processing customer data redaction:', error);
    // Still return 200 to acknowledge receipt
  }

  return new Response(null, { status: 200 });
};
