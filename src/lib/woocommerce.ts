import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const consumerKey = 'ck_67b089d0427cd989adc74aae4f6ebfa518ca3612';
const consumerSecret = 'cs_ffa2b6242d8ba6022d240036e801bc9b7f408c6f';

if (!consumerKey) {
  throw new Error("WOOCOMMERCE_CONSUMER_KEY is not defined in .env.local");
}
if (!consumerSecret) {
  throw new Error("WOOCOMMERCE_CONSUMER_SECRET is not defined in .env.local");
}


export const wooCommerce = new WooCommerceRestApi({
  url: 'https://tecnovacenter.shop/',
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  version: "wc/v3"
});
