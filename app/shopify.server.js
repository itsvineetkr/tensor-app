import "@shopify/shopify-app-remix/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
  BillingInterval,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.January25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  billing: {
    "Free Plan": {
      amount: 0,
      currencyCode: "USD",
      interval: BillingInterval.Every30Days,
    },
  },
  future: {
    unstable_newEmbeddedAuthStrategy: true,
    removeRest: true,
  },
  hooks: {
    afterAuth: async ({ session }) => {
      // Register mandatory privacy webhooks for GDPR/CCPA compliance
      shopify.registerWebhooks({ session });
      
      // Initialize billing subscription for new shops
      try {
        const existingSubscription = await prisma.billingSubscription.findUnique({
          where: { shop: session.shop }
        });
        
        if (!existingSubscription) {
          await prisma.billingSubscription.create({
            data: {
              shop: session.shop,
              planName: "FREE",
              status: "ACTIVE",
            }
          });
        }
      } catch (error) {
        console.error("Error creating billing subscription:", error);
      }
    },
  },
  webhooks: {
    APP_SUBSCRIPTIONS_UPDATE: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks/billing",
    },
    APP_PURCHASES_ONE_TIME_UPDATE: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks/billing",
    },
    CUSTOMERS_DATA_REQUEST: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks/customers/data_request",
    },
    CUSTOMERS_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks/customers/redact",
    },
    SHOP_REDACT: {
      deliveryMethod: "http",
      callbackUrl: "/webhooks/shop/redact", 
    },
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.January25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
export const billing = shopify.billing;
