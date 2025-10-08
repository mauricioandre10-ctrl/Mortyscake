// This file is no longer used for direct API calls from Next.js.
// The data fetching is now handled by client-side calls to PHP endpoints.

// You can keep this for reference or remove it.
// The original setup was:
/*
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const consumerKey = 'YOUR_WOOCOMMERCE_CONSUMER_KEY';
const consumerSecret = 'YOUR_WOOCOMMERCE_CONSUMER_SECRET';

if (!consumerKey) {
  throw new Error("WOOCOMMERCE_CONSUMER_KEY is not defined in .env.local");
}
if (!consumerSecret) {
  throw new Error("WOOCOMMERCE_CONSUMER_SECRET is not defined in .env.local");
}


export const wooCommerce = new WooCommerceRestApi({
  url: 'https://cms.mortyscake.es/',
  consumerKey: consumerKey,
  consumerSecret: consumerSecret,
  version: "wc/v3"
});
*/

// An example of what a PHP file (e.g., /api/get-products.php) on your Ionos server might look like:
/*
<?php
require __DIR__ . '/vendor/autoload.php';

use Automattic\WooCommerce\Client;

header("Access-Control-Allow-Origin: *"); // Adjust for production
header("Content-Type: application/json; charset=UTF-8");

$woocommerce = new Client(
    'https://cms.mortyscake.es',
    'YOUR_WOOCOMMERCE_CONSUMER_KEY', // <-- IMPORTANT: Replace with your actual key
    'YOUR_WOOCOMMERCE_CONSUMER_SECRET', // <-- IMPORTANT: Replace with your actual secret
    [
        'version' => 'wc/v3',
    ]
);

try {
    $params = $_GET; // Pass query params from frontend request
    $products = $woocommerce->get('products', $params);
    echo json_encode($products);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
*/
export {};
