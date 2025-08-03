import { Card, Text, Badge, LegacyStack, Divider } from "@shopify/polaris";

export function BillingCard({ subscription }) {
  const getPlanBadge = (planName, status) => {
    if (planName === "FREE") {
      return <Badge status="info">Free Plan</Badge>;
    }
    
    if (status === "ACTIVE") {
      return <Badge status="success">Active</Badge>;
    }
    
    return <Badge status="critical">Inactive</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card>
      <LegacyStack vertical spacing="loose">
        <LegacyStack alignment="center" distribution="equalSpacing">
          <Text variant="headingMd" as="h3">
            Billing Information
          </Text>
          {getPlanBadge(subscription?.planName, subscription?.status)}
        </LegacyStack>
        
        <Divider />
        
        <LegacyStack vertical spacing="tight">
          <LegacyStack distribution="equalSpacing">
            <Text as="span" variant="bodyMd" color="subdued">
              Current Plan:
            </Text>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              {subscription?.planName || "FREE"}
            </Text>
          </LegacyStack>
          
          <LegacyStack distribution="equalSpacing">
            <Text as="span" variant="bodyMd" color="subdued">
              Status:
            </Text>
            <Text as="span" variant="bodyMd" fontWeight="semibold">
              {subscription?.status || "ACTIVE"}
            </Text>
          </LegacyStack>
          
          <LegacyStack distribution="equalSpacing">
            <Text as="span" variant="bodyMd" color="subdued">
              Created:
            </Text>
            <Text as="span" variant="bodyMd">
              {formatDate(subscription?.createdAt)}
            </Text>
          </LegacyStack>
          
          {subscription?.planName === "FREE" && (
            <LegacyStack vertical spacing="extraTight">
              <Text variant="bodyMd" color="success" fontWeight="semibold">
                ✅ Free Plan Benefits:
              </Text>
              <Text variant="bodySm" color="subdued">
                • Full access to Tensor Search functionality
              </Text>
              <Text variant="bodySm" color="subdued">
                • API key management
              </Text>
              <Text variant="bodySm" color="subdued">
                • No monthly fees
              </Text>
            </LegacyStack>
          )}
        </LegacyStack>
      </LegacyStack>
    </Card>
  );
}
