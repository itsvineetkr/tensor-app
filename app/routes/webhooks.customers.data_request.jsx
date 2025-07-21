import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { shop, topic, payload } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  // Handle customer data request for GDPR compliance
  // This webhook is triggered when a customer requests their personal data
  // You should:
  // 1. Log the request for compliance purposes
  // 2. Gather and return customer data if your app stores any
  // 3. Send the data to the customer via the method specified in the request

  try {
    // Log the data request for compliance tracking
    console.log('Customer data request received:', {
      shop,
      customerId: payload.customer?.id,
      ordersRequested: payload.orders_requested || [],
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement your data collection logic here
    // Example: Query your database for any customer data you've stored
    // const customerData = await db.customerData.findMany({
    //   where: { customerId: payload.customer?.id, shop }
    // });

    // TODO: Send the collected data to the customer
    // This is typically done via email or through Shopify's API

    console.log('Customer data request processed successfully');
  } catch (error) {
    console.error('Error processing customer data request:', error);
    // Still return 200 to acknowledge receipt
  }

  return new Response(null, { status: 200 });
};
