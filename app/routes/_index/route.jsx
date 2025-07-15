import { redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

// Loader handles redirection if `shop` param exists
export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return { showForm: Boolean(login) };
};

export default function Index() {
  const { showForm } = useLoaderData();

  return (
    <div className={styles.index}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Supercharge Your Store Search</h1>
        <p className={styles.text}>
          Tensor Search helps your customers find exactly what they're looking for—fast, smart, and accurate.
        </p>

        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label className={styles.label}>
              <span>Enter your Shopify store domain</span>
              <input
                className={styles.input}
                type="text"
                name="shop"
                placeholder="e.g. my-store.myshopify.com"
                required
              />
            </label>
            <button className={styles.button} type="submit">
              Connect Your Store
            </button>
          </Form>
        )}

        <ul className={styles.list}>
          <li>
            <strong>AI-powered product discovery</strong> — Help your users find the right product even with vague or typo-ridden queries.
          </li>
          <li>
            <strong>Smart filters & relevance ranking</strong> — Sort results by what matters most to your customers: price, popularity, recency, etc.
          </li>
          <li>
            <strong>One-click theme integration</strong> — Easily embed advanced search directly into your storefront using our guided setup.
          </li>
        </ul>
      </div>
    </div>
  );
}
