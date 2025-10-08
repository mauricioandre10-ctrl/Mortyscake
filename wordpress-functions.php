<?php
/**
 * CÓDIGO PERSONALIZADO PARA EL TEMA DE MORTY'S CAKE
 *
 * Este archivo contiene todas las funciones personalizadas de PHP para el sitio de WordPress.
 * Incluye la configuración de la API REST para la comunicación con la aplicación Next.js,
 * la gestión del carrito y la obtención de productos.
 *
 * INSTRUCCIONES:
 * 1. Accede a tu panel de WordPress.
 * 2. Ve a Apariencia > Editor de archivos de temas.
 * 3. Asegúrate de tener seleccionado tu tema hijo (child theme).
 * 4. Busca y haz clic en el archivo `functions.php` (Funciones del Tema).
 * 5. Reemplaza el contenido existente con este código.
 * 6. Guarda los cambios.
 */

// =============================================================================
// 1. REGISTRO DE HOOKS
// =============================================================================

// Registra los endpoints personalizados de la API REST cuando WordPress se inicializa.
add_action('rest_api_init', 'morty_register_rest_routes');

// Inicializa la sesión de WooCommerce para las llamadas a la API de usuarios no autenticados.
add_action('init', 'morty_init_wc_session_for_api');


// =============================================================================
// 2. CONFIGURACIÓN DE LA API REST
// =============================================================================

/**
 * Registra todos los endpoints de la API y configura los encabezados CORS.
 */
function morty_register_rest_routes() {
    
    // --- Configuración de CORS ---
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed_origins = [
            'https://mortyscake.com',
            'https://mortyscake-website.vercel.app',
            'https://mortyscake-sitio-web-git-main-mauricio-s-projects-bb335663.vercel.app',
            'https://mortyscake-sitio-web-iyfpw5yl3-mauricio-s-projects-bb335663.vercel.app',
            'http://localhost:9002', // Desarrollo local
        ];

        $origin = get_http_origin();
        if ($origin && in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        } else {
            header('Access-Control-Allow-Origin: *');
        }

        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-WC-Session');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Expose-Headers: X-WC-Session');

        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit();
        }

        return $value;
    });

    // --- Registro de Endpoints ---
    $namespace = 'morty/v1';

    // Endpoint para obtener productos
    register_rest_route($namespace, '/products', [
        'methods' => 'GET',
        'callback' => 'morty_get_products_with_details',
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint para obtener el carrito
    register_rest_route($namespace, '/cart', [
        'methods' => 'GET',
        'callback' => function () { return new WP_REST_Response(morty_format_cart_data(), 200); },
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint para añadir al carrito
    register_rest_route($namespace, '/cart/add', [
        'methods' => 'POST',
        'callback' => 'morty_handle_cart_add',
        'permission_callback' => '__return_true',
    ]);

    // Endpoint para eliminar del carrito
    register_rest_route($namespace, '/cart/remove', [
        'methods' => 'POST',
        'callback' => 'morty_handle_cart_remove',
        'permission_callback' => '__return_true',
    ]);

    // Endpoint para actualizar el carrito
    register_rest_route($namespace, '/cart/update', [
        'methods' => 'POST',
        'callback' => 'morty_handle_cart_update',
        'permission_callback' => '__return_true',
    ]);

    // Endpoint para vaciar el carrito
    register_rest_route($namespace, '/cart/clear', [
        'methods' => 'POST',
        'callback' => function () {
            WC()->cart->empty_cart();
            return new WP_REST_Response(morty_format_cart_data(), 200);
        },
        'permission_callback' => '__return_true',
    ]);
}

/**
 * Inicializa la sesión de WC si no existe, para que el carrito persista entre llamadas a la API.
 */
function morty_init_wc_session_for_api() {
    if (strpos($_SERVER['REQUEST_URI'], '/wp-json/morty/v1/') !== false && !is_user_logged_in()) {
        if (isset(WC()->session) && !WC()->session->has_session()) {
            WC()->session->set_customer_session_cookie(true);
        }
    }
}

// =============================================================================
// 3. FUNCIONES DE MANEJO DEL CARRITO
// =============================================================================

/**
 * Formatea los datos del carrito para una respuesta JSON consistente y limpia.
 */
function morty_format_cart_data() {
    if (!isset(WC()->cart) || WC()->cart->is_empty()) {
        return [
            'items' => [],
            'item_count' => 0,
            'totals' => ['total_price' => '0.00'],
            'checkout_url' => wc_get_checkout_url(),
        ];
    }
    
    $cart_items = [];
    foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
        $product = $cart_item['data'];
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

/**
 * Maneja la adición de un producto al carrito desde la API.
 */
function morty_handle_cart_add(WP_REST_Request $request) {
    $product_id = $request->get_param('product_id');
    $quantity = $request->get_param('quantity') ? intval($request->get_param('quantity')) : 1;
    
    if (!$product_id) {
        return new WP_Error('bad_request', 'Product ID is required.', ['status' => 400]);
    }
    
    WC()->cart->add_to_cart($product_id, $quantity);
    
    return new WP_REST_Response(morty_format_cart_data(), 200);
}

/**
 * Maneja la eliminación de un producto del carrito desde la API.
 */
function morty_handle_cart_remove(WP_REST_Request $request) {
    $item_key = $request->get_param('item_key');
    if (!$item_key) {
        return new WP_Error('bad_request', 'Item key is required.', ['status' => 400]);
    }
    WC()->cart->remove_cart_item($item_key);
    return new WP_REST_Response(morty_format_cart_data(), 200);
}

/**
 * Maneja la actualización de la cantidad de un producto en el carrito desde la API.
 */
function morty_handle_cart_update(WP_REST_Request $request) {
    $item_key = $request->get_param('item_key');
    $quantity = $request->get_param('quantity');
    if (!$item_key || $quantity === null) {
        return new WP_Error('bad_request', 'Item key and quantity are required.', ['status' => 400]);
    }
    WC()->cart->set_quantity($item_key, intval($quantity));
    return new WP_REST_Response(morty_format_cart_data(), 200);
}

// =============================================================================
// 4. FUNCIONES DE MANEJO DE PRODUCTOS
// =============================================================================

/**
 * Obtiene y formatea una lista de productos de WooCommerce con detalles adicionales.
 */
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
        
        // Limpia datos que no se necesitan en el frontend.
        unset($product_data['downloads'], $product_data['meta_data']);
        $product_data['price'] = wc_format_decimal($product->get_price(), 2);
        
        // Añade detalles adicionales.
        $product_data['category_names'] = morty_get_product_terms($product->get_id(), 'product_cat', 'name');
        $product_data['tags'] = morty_get_product_terms($product->get_id(), 'product_tag');
        $product_data['attributes'] = morty_get_product_attributes($product);
        $product_data['images'] = morty_get_product_images($product);
        $product_data['reviews'] = morty_get_product_reviews($product->get_id());

        $data[] = $product_data;
    }

    return new WP_REST_Response($data, 200);
}

/**
 * Helper para obtener los términos (categorías, etiquetas) de un producto.
 */
function morty_get_product_terms($product_id, $taxonomy, $field = null) {
    $terms = get_the_terms($product_id, $taxonomy);
    if (empty($terms) || is_wp_error($terms)) {
        return [];
    }
    if ($field === 'name') {
        return wp_list_pluck($terms, 'name');
    }
    return array_map(function($term) {
        return ['name' => $term->name, 'slug' => $term->slug];
    }, $terms);
}

/**
 * Helper para obtener los atributos visibles de un producto.
 */
function morty_get_product_attributes($product) {
    $attributes_data = [];
    $attributes = $product->get_attributes();
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

/**
 * Helper para obtener todas las imágenes de un producto (destacada y galería).
 */
function morty_get_product_images($product) {
    $images = [];
    $attachment_ids = array_filter(array_merge([$product->get_image_id()], $product->get_gallery_image_ids()));
    
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

    // Si no hay imágenes, se proporciona una de placeholder.
    if (empty($images)) {
        $images[] = [
            'id' => 0,
            'src' => wc_placeholder_img_src(),
            'alt' => 'Placeholder Image',
        ];
    }
    
    return $images;
}

/**
 * Helper para obtener las reseñas de un producto.
 */
function morty_get_product_reviews($product_id) {
    if (!$product_id) return [];

    $comments = get_comments([
        'post_id' => $product_id,
        'status' => 'approve',
        'type' => 'review',
        'orderby' => 'comment_date_gmt',
        'order' => 'DESC',
    ]);
    
    $reviews = [];
    foreach ($comments as $comment) {
        $avatar_urls = [
            '24' => get_avatar_url($comment, ['size' => 24]),
            '48' => get_avatar_url($comment, ['size' => 48]),
            '96' => get_avatar_url($comment, ['size' => 96]),
        ];

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
