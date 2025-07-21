import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { payload, session, topic, shop } = await authenticate.webhook(request);
  
  // Dynamic import to avoid client-side bundling issues
  const { default: db } = await import("../db.server");

  console.log(`Received ${topic} webhook for ${shop}`);
  const current = payload.current;

  if (session) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data: {
        scope: current.toString(),
      },
    });
  }

  return new Response();
};
