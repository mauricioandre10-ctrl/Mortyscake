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
            'https://studiodev.page',
            'https://6000-firebase-studio-1757332496117.cluster-lu4mup47g5gm4rtyvhzpwbfadi.cloudworkstations.dev'
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

function morty_get_product_details($product) {
    if (!$product) {
        return null;
    }
    $product_id = $product->get_id();
    $product_data = [
        'id' => $product_id,
        'name' => $product->get_name(),
        'slug' => $product->get_slug(),
        'price' => wc_format_decimal($product->get_price(), 2),
        'date_created' => $product->get_date_created() ? $product->get_date_created()->getTimestamp() * 1000 : null,
        'short_description' => $product->get_short_description(),
        'description' => $product->get_description(),
        'sku' => $product->get_sku(),
        'menu_order' => $product->get_menu_order(),
        'average_rating' => (float) $product->get_average_rating(),
        'rating_count' => (int) $product->get_rating_count(),
    ];

    // Images
    $image_ids = $product->get_gallery_image_ids();
    $main_image_id = $product->get_image_id();
    if ($main_image_id) {
        array_unshift($image_ids, $main_image_id);
    }
    $images = [];
    foreach ($image_ids as $image_id) {
        $image_url = wp_get_attachment_url($image_id);
        $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
        if ($image_url) {
            $images[] = [
                'id' => $image_id,
                'src' => $image_url,
                'alt' => $image_alt ?: $product->get_name(),
            ];
        }
    }
    $product_data['images'] = $images;
    
    // Categories
    $category_ids = $product->get_category_ids();
    $category_names = [];
    foreach ($category_ids as $category_id) {
        $term = get_term($category_id, 'product_cat');
        if ($term && !is_wp_error($term)) {
            $category_names[] = $term->name;
        }
    }
    $product_data['category_names'] = $category_names;

    // Tags
    $tag_ids = $product->get_tag_ids();
    $tags = [];
    foreach ($tag_ids as $tag_id) {
        $term = get_term($tag_id, 'product_tag');
        if ($term && !is_wp_error($term)) {
            $tags[] = ['name' => $term->name, 'slug' => $term->slug];
        }
    }
    $product_data['tags'] = $tags;

    // Attributes
    $attributes = [];
    foreach ($product->get_attributes() as $attribute) {
        if ($attribute->get_visible()) {
            $attributes[] = [
                'name' => $attribute->get_name(),
                'options' => $attribute->get_options(),
            ];
        }
    }
    $product_data['attributes'] = $attributes;

    // Reviews
    $reviews = [];
    $comments = get_comments(['post_id' => $product_id, 'status' => 'approve', 'type' => 'review']);
    foreach ($comments as $comment) {
        $reviews[] = [
            'id' => $comment->comment_ID,
            'review' => $comment->comment_content,
            'rating' => (int) get_comment_meta($comment->comment_ID, 'rating', true),
            'reviewer' => $comment->comment_author,
            'reviewer_avatar_urls' => get_avatar_data($comment->comment_author_email),
            'date_created' => $comment->comment_date_gmt,
        ];
    }
    $product_data['reviews'] = $reviews;

    return $product_data;
}

// Registrar endpoints
add_action('rest_api_init', function () {
    // Endpoint para obtener productos
    register_rest_route('morty/v1', '/products', [
        'methods' => WP_REST_Server::READABLE,
        'callback' => 'morty_get_products_callback',
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint para crear intención de pago
    register_rest_route('morty/v1', '/create-payment-intent', [
        'methods' => 'POST',
        'callback' => 'morty_create_payment_intent',
        'permission_callback' => '__return_true'
    ]);

    // Endpoint para crear el pedido
    register_rest_route('morty/v1', '/create-order', [
        'methods' => 'POST',
        'callback' => 'morty_create_order',
        'permission_callback' => '__return_true'
    ]);
});

function morty_get_products_callback(WP_REST_Request $request) {
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_not_active', 'WooCommerce no está activado.', ['status' => 500]);
    }
    
    $params = $request->get_params();
    $args = ['status' => 'publish', 'limit' => -1];

    if (!empty($params['slug'])) {
        $post = get_page_by_path($params['slug'], OBJECT, 'product');
        if ($post) {
            $product = wc_get_product($post->ID);
            if ($product) {
                // Check if this is an exact match for the slug
                if ($product->get_slug() === $params['slug']) {
                    $data = morty_get_product_details($product);
                    return new WP_REST_Response([$data], 200);
                }
            }
        }
        return new WP_REST_Response([], 200);
    }

    if (!empty($params['category_slug'])) {
        $args['category'] = [$params['category_slug']];
    }
    if (!empty($params['per_page'])) {
        $args['limit'] = (int) $params['per_page'];
    }
     if (!empty($params['category_exclude_slug'])) {
        $excluded_cat_term = get_term_by('slug', $params['category_exclude_slug'], 'product_cat');
        if ($excluded_cat_term) {
            $args['tax_query'] = [
                [
                    'taxonomy' => 'product_cat',
                    'field' => 'term_id',
                    'terms' => $excluded_cat_term->term_id,
                    'operator' => 'NOT IN',
                ],
            ];
        }
    }

    $products = wc_get_products($args);
    $data = [];

    foreach ($products as $product) {
        $details = morty_get_product_details($product);
        if ($details) {
            $data[] = $details;
        }
    }

    return new WP_REST_Response($data, 200);
}


function morty_create_payment_intent(WP_REST_Request $request) {
    if (!class_exists('WC_Stripe_Gateway')) {
        return new WP_Error('stripe_not_active', 'Stripe for WooCommerce no está activado.', ['status' => 500]);
    }

    $body = $request->get_json_params();
    $amount = isset($body['amount']) ? $body['amount'] : 0;
    $currency = isset($body['currency']) ? $body['currency'] : 'eur';

    if (empty($amount)) {
        return new WP_Error('invalid_amount', 'El importe no puede ser cero.', ['status' => 400]);
    }

    $stripe_gateway = new WC_Stripe_Gateway();
    $stripe = $stripe_gateway->get_stripe_client();

    try {
        $intent = $stripe->payment_intents->create([
            'amount' => $amount,
            'currency' => $currency,
            'payment_method_types' => ['card'],
        ]);

        return new WP_REST_Response(['client_secret' => $intent->client_secret], 200);

    } catch (Exception $e) {
        return new WP_Error('stripe_error', 'Error al crear la intención de pago: ' . $e->getMessage(), ['status' => 500]);
    }
}


function morty_create_order(WP_REST_Request $request) {
    $params = $request->get_json_params();

    $billing_details = $params['billingDetails'];
    $cart_items = $params['cartItems'];
    $payment_intent_id = $params['paymentIntentId'];

    if (empty($billing_details) || empty($cart_items) || empty($payment_intent_id)) {
        return new WP_Error('invalid_data', 'Faltan datos para crear el pedido.', ['status' => 400]);
    }

    try {
        $address = [
            'first_name' => $billing_details['firstName'],
            'last_name' => $billing_details['lastName'],
            'address_1' => $billing_details['address'],
            'city' => $billing_details['city'],
            'postcode' => $billing_details['zip'],
            'country' => 'ES', // Asumiendo España
            'email' => $billing_details['email'],
            'phone' => $billing_details['phone'],
        ];

        $order = wc_create_order();

        $order->set_address($address, 'billing');

        foreach ($cart_items as $item) {
            $product = wc_get_product($item['id']);
            if ($product) {
                $order->add_product($product, $item['quantity']);
            }
        }

        $order->set_payment_method('stripe');
        $order->set_payment_method_title('Stripe (Tarjeta de crédito)');
        $order->set_transaction_id($payment_intent_id);

        $order->calculate_totals();
        $order->update_status('processing', 'Pedido pagado a través de la API personalizada con Stripe.', true);

        // Guardar el pedido
        $order_id = $order->save();

        return new WP_REST_Response(['orderId' => $order_id], 200);

    } catch (Exception $e) {
        return new WP_Error('order_creation_failed', 'Error al crear el pedido: ' . $e->getMessage(), ['status' => 500]);
    }
}

// Función para añadir la URL de la imagen destacada a la API de entradas
function add_featured_image_to_posts_api($data, $post, $request) {
    if (isset($post->ID) && has_post_thumbnail($post->ID)) {
        $featured_image_id = get_post_thumbnail_id($post->ID);
        $featured_image_url = wp_get_attachment_image_url($featured_image_id, 'full');
        $data->data['featured_image_url'] = $featured_image_url;
    } else {
        $data->data['featured_image_url'] = null;
    }
    return $data;
}

// Enganchar la función al hook de la API REST para las entradas
add_filter('rest_prepare_post', 'add_featured_image_to_posts_api', 10, 3);

?>