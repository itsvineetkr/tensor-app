import { authenticate } from "../shopify.server";
import { createOrUpdateSubscription } from "../utils/billing.server";

export const action = async ({ request }) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  if (!shop) {
    throw new Response();
  }

  try {
    switch (topic) {
      case "APP_SUBSCRIPTIONS_UPDATE": {
        const subscription = payload.app_subscription;
        await createOrUpdateSubscription(shop, {
          subscriptionId: subscription.id,
          planName: subscription.name,
          status: subscription.status,
          trialStartsAt: subscription.trial_starts_at ? new Date(subscription.trial_starts_at) : null,
          trialEndsAt: subscription.trial_ends_at ? new Date(subscription.trial_ends_at) : null,
          billingOn: subscription.billing_on ? new Date(subscription.billing_on) : null,
          test: subscription.test || false,
        });
        break;
      }
      case "APP_PURCHASES_ONE_TIME_UPDATE": {
        const purchase = payload.app_purchase_one_time;
        await createOrUpdateSubscription(shop, {
          subscriptionId: purchase.id,
          planName: purchase.name,
          status: purchase.status,
          test: purchase.test || false,
        });
        break;
      }
      default:
        console.log(`Unhandled billing webhook topic: ${topic}`);
    }
  } catch (error) {
    console.error(`Error processing billing webhook for ${shop}:`, error);
    throw new Response("Webhook processing failed", { status: 500 });
  }

  throw new Response();
};
