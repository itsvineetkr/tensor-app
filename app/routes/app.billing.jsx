import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Layout, Card, Text, LegacyStack, Badge, Button, Banner } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { getBillingSubscription } from "../utils/billing.server";
import { BillingCard } from "../components/BillingCard";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  
  const subscription = await getBillingSubscription(session.shop);
  
  return json({
    shop: session.shop,
    subscription
  });
};

export default function Billing() {
  const { shop, subscription } = useLoaderData();

  return (
    <Page>
      <TitleBar title="Billing & Subscription" />
      <Layout>
        <Layout.Section>
          <Banner title="Free Plan Active" status="success">
            You're currently on our Free Plan with full access to all Tensor Search features at no cost.
          </Banner>
        </Layout.Section>
        
        <Layout.Section>
          <BillingCard subscription={subscription} />
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <LegacyStack vertical spacing="loose">
              <LegacyStack alignment="center" distribution="equalSpacing">
                <Text variant="headingMd" as="h3">
                  Free Tier Benefits
                </Text>
                <Badge status="success">Always Free</Badge>
              </LegacyStack>
              
              <Text variant="bodyMd" color="subdued">
                Our Free Plan is designed to give you complete access to Tensor Search capabilities 
                without any hidden costs or feature limitations.
              </Text>
              
              <LegacyStack vertical spacing="tight">
                <Text variant="bodyMd" fontWeight="semibold" color="success">
                  ✅ What's Included:
                </Text>
                <Text variant="bodySm">• Complete intelligent search functionality</Text>
                <Text variant="bodySm">• Full API key management system</Text>
                <Text variant="bodySm">• Unlimited product synchronization</Text>
                <Text variant="bodySm">• Complete Shopify store integration</Text>
                <Text variant="bodySm">• Search extension for your storefront</Text>
                <Text variant="bodySm">• Regular updates and improvements</Text>
                <Text variant="bodySm">• Customer support</Text>
              </LegacyStack>
              
              <Text variant="bodyMd" fontWeight="semibold" color="subdued">
                No credit card required • No monthly fees • No usage limits
              </Text>
            </LegacyStack>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <LegacyStack vertical spacing="loose">
              <Text variant="headingMd" as="h3">
                Getting Started
              </Text>
              <Text variant="bodyMd" color="subdued">
                Ready to enhance your store's search experience? Follow these simple steps:
              </Text>
              <LegacyStack vertical spacing="tight">
                <Text variant="bodySm">1. Complete the setup process on the main dashboard</Text>
                <Text variant="bodySm">2. Get your API key from Tensor Solution</Text>
                <Text variant="bodySm">3. Sync your products with our search system</Text>
                <Text variant="bodySm">4. Add the search extension to your store</Text>
              </LegacyStack>
              <Button primary url="/app">
                Go to Dashboard
              </Button>
            </LegacyStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
