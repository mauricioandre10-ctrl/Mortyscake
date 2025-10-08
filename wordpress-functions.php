<?php
// =============================================================================
// CORS Configuration
// =============================================================================
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', 'morty_cors_headers', 15);
});

function morty_cors_headers($value) {
    $allowed_origins = [
        'https://mortyscake-website.vercel.app',
        'https://mortyscake-website-git-main-mauricio-s-projects-bb335663.vercel.app'
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
}

// =============================================================================
// API Route Registration
// =============================================================================
add_action('rest_api_init', 'morty_register_rest_routes');

function morty_register_rest_routes() {
    $namespace = 'morty/v1';

    register_rest_route($namespace, '/products', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'morty_get_products_with_details',
        'permission_callback' => '__return_true',
        'args' => [
            'per_page' => [
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
            'slug' => [
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'category_slug' => [
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'category_exclude_slug' => [
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);

    register_rest_route($namespace, '/cart', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'morty_handle_get_cart',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route($namespace, '/cart/add', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'morty_handle_cart_add',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route($namespace, '/cart/remove', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'morty_handle_cart_remove',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route($namespace, '/cart/update', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'morty_handle_cart_update',
        'permission_callback' => '__return_true',
    ]);
    register_rest_route($namespace, '/cart/clear', [
        'methods' => WP_REST_Server::CREATABLE,
        'callback' => 'morty_handle_cart_clear',
        'permission_callback' => '__return_true',
    ]);
}

// =============================================================================
// WC Session Initialization
// =============================================================================
add_action('init', 'morty_init_wc_session_for_api');

function morty_init_wc_session_for_api() {
    if (strpos($_SERVER['REQUEST_URI'], '/wp-json/morty/v1/cart') !== false && !is_user_logged_in()) {
        if (isset(WC()->session) && !WC()->session->has_session()) {
            WC()->session->set_customer_session_cookie(true);
        }
    }
}

// =============================================================================
// Cart Handling Callbacks
// =============================================================================
function morty_handle_get_cart() {
    return new WP_REST_Response(morty_format_cart_data(), 200);
}
function morty_handle_cart_clear() {
    if (function_exists('WC') && WC()->cart) {
        WC()->cart->empty_cart();
    }
    return new WP_REST_Response(morty_format_cart_data(), 200);
}
function morty_handle_cart_add(WP_REST_Request $request) {
    $product_id = $request->get_param('product_id');
    $quantity = $request->get_param('quantity') ? intval($request->get_param('quantity')) : 1;
    if (!$product_id || !function_exists('WC') || !WC()->cart) {
        return new WP_Error('bad_request', 'Product ID is required.', ['status' => 400]);
    }
    WC()->cart->add_to_cart($product_id, $quantity);
    return new WP_REST_Response(morty_format_cart_data(), 200);
}
function morty_handle_cart_remove(WP_REST_Request $request) {
    $item_key = $request->get_param('item_key');
    if (!$item_key || !function_exists('WC') || !WC()->cart) {
        return new WP_Error('bad_request', 'Item key is required.', ['status' => 400]);
    }
    WC()->cart->remove_cart_item($item_key);
    return new WP_REST_Response(morty_format_cart_data(), 200);
}
function morty_handle_cart_update(WP_REST_Request $request) {
    $item_key = $request->get_param('item_key');
    $quantity = $request->get_param('quantity');
    if (!$item_key || $quantity === null || !function_exists('WC') || !WC()->cart) {
        return new WP_Error('bad_request', 'Item key and quantity are required.', ['status' => 400]);
    }
    WC()->cart->set_quantity($item_key, intval($quantity));
    return new WP_REST_Response(morty_format_cart_data(), 200);
}

// =============================================================================
// Data Formatting Helpers
// =============================================================================
function morty_format_cart_data() {
    if (!function_exists('WC') || !isset(WC()->cart) || WC()->cart->is_empty()) {
        return [
            'items' => [],
            'item_count' => 0,
            'totals' => ['total_price' => '0.00'],
            'checkout_url' => function_exists('wc_get_checkout_url') ? wc_get_checkout_url() : '',
        ];
    }
    $cart_items = [];
    foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
        $product = $cart_item['data'];
        if (!$product) continue;
        $image_id = $product->get_image_id();
        $image_url = wp_get_attachment_image_url($image_id, 'thumbnail');
        $cart_items[] = [
            'key' => $cart_item_key,
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'quantity' => $cart_item['quantity'],
            'price' => wc_format_decimal($product->get_price(), 2),
            'line_subtotal' => wc_format_decimal($cart_item['line_subtotal'], 2),
            'image' => [
                'src' => $image_url ?: wc_placeholder_img_src(),
                'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
            ],
        ];
    }
    return [
        'items' => $cart_items,
        'item_count' => WC()->cart->get_cart_contents_count(),
        'totals' => ['total_price' => wc_format_decimal(WC()->cart->get_total('edit'), 2)],
        'checkout_url' => wc_get_checkout_url(),
    ];
}

function morty_get_products_with_details(WP_REST_Request $request) {
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_not_active', 'WooCommerce no está activado.', ['status' => 500]);
    }
    $params = $request->get_params();
    $args = [
        'status' => 'publish',
        'limit' => isset($params['per_page']) ? intval($params['per_page']) : -1,
        'paginate' => false,
    ];
    if (!empty($params['slug'])) {
        $args['slug'] = sanitize_text_field($params['slug']);
    }
    if (!empty($params['category_slug'])) {
        $args['category'] = [sanitize_text_field($params['category_slug'])];
    }
    if (!empty($params['category_exclude_slug'])) {
        $term = get_term_by('slug', sanitize_text_field($params['category_exclude_slug']), 'product_cat');
        if ($term) {
            $args['category__not_in'] = [$term->term_id];
        }
    }
    $products = wc_get_products($args);
    $data = [];
    foreach ($products as $product) {
        if (!$product) continue;
        $product_data = $product->get_data();
        unset($product_data['downloads'], $product_data['meta_data']);
        $product_data['price'] = wc_format_decimal($product->get_price(), 2);
        $product_data['category_names'] = morty_get_product_terms($product->get_id(), 'product_cat', 'name');
        $product_data['tags'] = morty_get_product_terms($product->get_id(), 'product_tag');
        $product_data['attributes'] = morty_get_product_attributes($product);
        $product_data['images'] = morty_get_product_images($product);
        $product_data['reviews'] = morty_get_product_reviews($product->get_id());
        $data[] = $product_data;
    }
    return new WP_REST_Response($data, 200);
}

function morty_get_product_terms($product_id, $taxonomy, $field = null) {
    $terms = get_the_terms($product_id, $taxonomy);
    if (empty($terms) || is_wp_error($terms)) return [];
    if ($field === 'name') return wp_list_pluck($terms, 'name');
    return array_map(function($term) {
        return ['name' => $term->name, 'slug' => $term->slug];
    }, $terms);
}

function morty_get_product_attributes($product) {
    $attributes_data = [];
    $attributes = $product->get_attributes();
    if (empty($attributes)) return $attributes_data;
    foreach ($attributes as $attribute) {
        if ($attribute->get_visible()) {
            $attributes_data[] = [
                'name' => wc_get_attribute_label($attribute->get_name()),
                'options' => $attribute->get_options(),
            ];
        }
    }
    return $attributes_data;
}

function morty_get_product_images($product) {
    $images = [];
    $attachment_ids = array_filter(array_merge([$product->get_image_id()], $product->get_gallery_image_ids()));
    if (!empty($attachment_ids)) {
        foreach (array_unique($attachment_ids) as $image_id) {
            $image_url = wp_get_attachment_url($image_id);
            if ($image_url) {
                $images[] = [
                    'id' => intval($image_id),
                    'src' => $image_url,
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                ];
            }
        }
    }
    if (empty($images) && function_exists('wc_placeholder_img_src')) {
        $images[] = ['id' => 0, 'src' => wc_placeholder_img_src(), 'alt' => 'Placeholder Image'];
    }
    return $images;
}

function morty_get_product_reviews($product_id) {
    if (!$product_id) return [];
    $comments = get_comments(['post_id' => $product_id, 'status' => 'approve', 'type' => 'review', 'orderby' => 'comment_date_gmt', 'order' => 'DESC']);
    $reviews = [];
    if (empty($comments)) return $reviews;
    foreach ($comments as $comment) {
        $avatar_urls = ['24' => get_avatar_url($comment, ['size' => 24]), '48' => get_avatar_url($comment, ['size' => 48]), '96' => get_avatar_url($comment, ['size' => 96])];
        $reviews[] = [
            'id' => $comment->comment_ID,
            'date_created' => $comment->comment_date_gmt,
            'review' => $comment->comment_content,
            'rating' => intval(get_comment_meta($comment->comment_ID, 'rating', true)),
            'reviewer' => $comment->comment_author,
            'reviewer_avatar_urls' => $avatar_urls,
        ];
    }
    return $reviews;
}
?>