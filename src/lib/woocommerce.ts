import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

if (!process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL) {
  throw new Error(
    "NEXT_PUBLIC_WOOCOMMERCE_STORE_URL is not defined in .env.local"
  );
}
if (!process.env.WOOCOMMERCE_CONSUMER_KEY) {
  throw new Error("WOOCOMMERCE_CONSUMER_KEY is not defined in .env.local");
}
if (!process.env.WOOCOMMERCE_CONSUMER_SECRET) {
  throw new Error("WOOCOMMERCE_CONSUMER_SECRET is not defined in .env.local");
}


export const wooCommerce = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  version: "wc/v3"
});
