<?php
if (function_exists('set_time_limit')) {
    set_time_limit(30);
}

// CORS headers
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed_origins = [
            'https://mortyscake-website.vercel.app',
            'https://mortyscake-website-git-main-mauricio-s-projects-bb335663.vercel.app',
            'http://localhost:3000',
            'http://localhost:9002',
            'https://studiodev.page'
        ];
        $origin = get_http_origin();
        if ($origin && in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, Authorization');
            header('Access-Control-Allow-Credentials: true');
        }
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit();
        }
        return $value;
    }, 15);
}, 15);

// Registrar endpoint básico
add_action('rest_api_init', function () {
    register_rest_route('morty/v1', '/products', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => function (WP_REST_Request $request) {
            if (!class_exists('WooCommerce')) {
                return new WP_Error('woocommerce_not_active', 'WooCommerce no está activado.', ['status' => 500]);
            }

            $products = wc_get_products(['status' => 'publish', 'limit' => 5]);
            $data = [];

            foreach ($products as $product) {
                $data[] = [
                    'id' => $product->get_id(),
                    'name' => $product->get_name(),
                    'price' => wc_format_decimal($product->get_price(), 2),
                ];
            }

            return new WP_REST_Response($data, 200);
        },
        'permission_callback' => '__return_true',
    ]);
});
?>