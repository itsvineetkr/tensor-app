import { authenticate } from '../shopify.server';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { json } from "@remix-run/node";
import { requireActiveBilling } from '../utils/billing.server';


const prisma = new PrismaClient();


function flattenProductsByVariants(products) {
  const flattened = [];

  for (const product of products) {
    const variantEdges = product.variants?.edges || [];

    for (const variantEdge of variantEdges) {
      const variant = variantEdge.node;

      flattened.push({
        title: product.title,
        handle: product.handle,
        description: product.description,
        productId: product.id,
        variantId: variant.id,
        price: parseFloat(variant.price),
        sku: variant.sku,
        availableForSale: variant.availableForSale,
        inventoryQuantity: variant.inventoryQuantity,
        variantTitle: variant.title,
        image: variant.image?.url || null,
        // add other fields you want here
      });
    }
  }

  return flattened;
}

async function fetchAllProducts(admin) {
    const allProducts = [];
    let hasNextPage = true;
    let cursor = null;

    const PRODUCTS_QUERY = `#graphql
    query GetProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            status
            createdAt
            updatedAt
            publishedAt
            productType
            vendor
            tags
            totalInventory
            tracksInventory
            onlineStoreUrl
            seo {
              title
              description
            }
            options {
              id
              name
              values
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  price
                  compareAtPrice
                  sku
                  barcode
                  inventoryQuantity
                  taxable
                  inventoryPolicy
                  availableForSale
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
            media(first: 20) {
              edges {
                node {
                  ... on MediaImage {
                    id
                    image {
                      url
                      altText
                      width
                      height
                    }
                    mediaContentType
                  }
                }
              }
            }
            collections(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
            metafields(first: 50) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                  type
                }
              }
            }
          }
        }
      }
    }`;

    while (hasNextPage) {
        const response = await admin.graphql(PRODUCTS_QUERY, {
            variables: {
                first: 50,
                after: cursor,
            },
        });

        const responseText = await response.text();
        let responseJson;
        
        try {
            responseJson = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError.message);
            console.error('Response text:', responseText.substring(0, 500));
            throw new Error(`Failed to parse GraphQL response: ${parseError.message}`);
        }

        if (responseJson.errors) {
            throw new Error(`GraphQL Error: ${JSON.stringify(responseJson.errors)}`);
        }

        const { products } = responseJson.data;
        allProducts.push(...products.edges.map(edge => edge.node));

        hasNextPage = products.pageInfo.hasNextPage;
        cursor = products.pageInfo.endCursor;
    }

    return flattenProductsByVariants(allProducts);
}

async function syncProductsToAPI(products, shopDomain, apiKey) {
    // Convert to JSONL format
    const jsonlData = products.map(product => JSON.stringify(product)).join('\n');

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('shop_domain', shopDomain);

    const blob = new Blob([jsonlData], { type: 'application/x-jsonlines' });
    formData.append('data', blob, 'products.jsonl');

    // Send to external API
    const apiResponse = await axios.post(
        'https://bckn.tensorsolution.in/api/v1/sync-shopify-data',
        formData,
        {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${apiKey}`
            },
            timeout: 60000, // 60 second timeout for large datasets
        }
    );

    return apiResponse.data;
}

function handleSyncError(error) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return json({
                success: false,
                message: `API request failed: ${error.response.status} - ${error.response.statusText}`,
                details: error.response.data
            });
        } else if (error.request) {
            return json({
                success: false,
                message: 'Network error: Unable to reach the API server'
            });
        }
    }

    return json({
        success: false,
        message: `Sync failed: ${error.message}`
    });
}

export const action = async ({ request }) => {
    if (request.method !== "POST") {
        throw new Response("Method not allowed", { status: 405 });
    }

    const { admin, session } = await authenticate.admin(request);

    // Check billing status
    await requireActiveBilling(session);

    try {
        const shopDomain = session.shop;
        const products = await fetchAllProducts(admin);
        
        const apiKeyRecord = await prisma.APIKeys.findFirst({
          where: {
            shop_domain: shopDomain,
          },
        });
        
        const syncResult = await syncProductsToAPI(products, shopDomain, apiKeyRecord.api_key);
        
        return json({
            success: true,
            message: `Successfully synced ${products.length} products from ${shopDomain}`,
            shopDomain,
            productCount: products.length,
            apiResult: syncResult
        });

    } catch (error) {
        console.error('Sync error:', error);
        return handleSyncError(error);
    }
};
