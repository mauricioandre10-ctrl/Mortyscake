<?php

function morty_cors_headers() {
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
}
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        morty_cors_headers();
        return $value;
    }, 15);
}, 15);


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
}
add_action('rest_api_init', 'morty_register_rest_routes');

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

    