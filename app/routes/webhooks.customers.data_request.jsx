import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // This app does not store any customer personal data
  // We only work with product data for search functionality
  // Therefore, we have no customer data to provide
  
  try {
    console.log('Customer data request received:', {
      shop,
      customerId: payload.customer?.id,
      timestamp: new Date().toISOString(),
      response: 'No customer data stored by this app'
    });

    // Return success since we've acknowledged the request
    // but we don't store any customer data to provide
    return new Response(null, { status: 200 });
    // This is typically done via email or through Shopify's API

    console.log('Customer data request processed successfully');
  } catch (error) {
    console.error('Error processing customer data request:', error);
    // Still return 200 to acknowledge receipt
  }

  return new Response(null, { status: 200 });
};
