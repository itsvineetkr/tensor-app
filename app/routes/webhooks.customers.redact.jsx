import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This app does not store any customer personal data
  // We only work with product data for search functionality  
  // Therefore, we have no customer data to redact

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
      response: 'No customer data stored by this app to redact'
    });

    // Return success since we've acknowledged the request
    // but we don't store any customer data to redact
    return new Response(null, { status: 200 });
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
