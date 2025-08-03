import {
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Button,
  Badge,
  LegacyStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function AdditionalPage() {
  return (
    <Page>
      <TitleBar title="Help & Documentation" />
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="500">
              <LegacyStack alignment="center" distribution="equalSpacing">
                <Text as="h2" variant="headingMd">
                  Tensor Search Documentation
                </Text>
                <Badge status="info">Free Plan</Badge>
              </LegacyStack>
              
              <Text as="p" variant="bodyMd">
                Welcome to the Tensor Search help center. Here you'll find everything you need 
                to get the most out of your intelligent search solution.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Quick Start Guide
              </Text>
              <List>
                <List.Item>
                  <strong>Step 1:</strong> Sign up at{" "}
                  <Link
                    url="https://search.tensorsolution.in/"
                    target="_blank"
                    removeUnderline
                  >
                    Tensor Solution
                  </Link>{" "}
                  to get your API key
                </List.Item>
                <List.Item>
                  <strong>Step 2:</strong> Enter your API key in the main dashboard
                </List.Item>
                <List.Item>
                  <strong>Step 3:</strong> Sync your products with our search system
                </List.Item>
                <List.Item>
                  <strong>Step 4:</strong> Add the search extension to your storefront
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Features & Benefits
              </Text>
              <List>
                <List.Item>
                  <strong>Intelligent Search:</strong> AI-powered search that understands customer intent
                </List.Item>
                <List.Item>
                  <strong>Real-time Sync:</strong> Automatically keeps your search index updated
                </List.Item>
                <List.Item>
                  <strong>Easy Integration:</strong> Simple setup with your existing Shopify store
                </List.Item>
                <List.Item>
                  <strong>Free Forever:</strong> Full functionality at no cost
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Need Help?
              </Text>
              <Text as="p" variant="bodyMd">
                If you encounter any issues or have questions about Tensor Search, 
                we're here to help.
              </Text>
              <LegacyStack spacing="tight">
                <Button
                  url="https://search.tensorsolution.in/"
                  target="_blank"
                  primary
                >
                  Visit Documentation
                </Button>
                <Button
                  url="/app"
                >
                  Back to Dashboard
                </Button>
              </LegacyStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
