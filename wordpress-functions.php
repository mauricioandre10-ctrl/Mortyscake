<?php
/**
 * CÓDIGO PARA AÑADIR AL `functions.php` DE TU TEMA HIJO EN WORDPRESS.
 *
 * INSTRUCCIONES:
 * 1. Accede a tu panel de WordPress.
 * 2. Ve a Apariencia > Editor de archivos de temas.
 * 3. Asegúrate de tener seleccionado tu tema hijo (child theme).
 * 4. Busca y haz clic en el archivo `functions.php` (Funciones del Tema).
 * 5. Copia TODO este código y pégalo al final del archivo.
 * 6. Guarda los cambios.
 */

// **AÑADIDO IMPORTANTE PARA CORS**
// Esto soluciona los errores "Failed to fetch" al llamar a la API desde un dominio diferente.
add_action( 'rest_api_init', function() {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
    add_filter( 'rest_pre_serve_request', function( $value ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: GET' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce' );
        return $value;
    });
}, 15 );

add_action('rest_api_init', function () {
    // Endpoint para obtener productos con varios filtros
    register_rest_route('morty/v1', '/products', array(
        'methods' => 'GET',
        'callback' => 'morty_get_products',
        'permission_callback' => '__return_true'
    ));

    // Endpoint para obtener una categoría por su slug
    register_rest_route('morty/v1', '/category-by-slug', array(
        'methods' => 'GET',
        'callback' => 'morty_get_category_by_slug',
        'permission_callback' => '__return_true'
    ));
});

/**
 * Función que maneja la petición para obtener productos de WooCommerce.
 */
function morty_get_products(WP_REST_Request $request) {
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_not_active', 'WooCommerce no está activado.', array('status' => 500));
    }

    $params = $request->get_params();
    $args = array(
        'status' => 'publish',
        'limit' => isset($params['per_page']) ? intval($params['per_page']) : 10,
        'paginate' => false,
    );

    // ************ CORRECCIÓN CLAVE ************
    // Si se pasa un 'slug', la búsqueda debe ser específica para ese producto.
    if (!empty($params['slug'])) {
        $args['slug'] = sanitize_text_field($params['slug']);
        // Cuando se busca por slug, es bueno poner el límite a 1.
        $args['limit'] = 1; 
    } else {
        // Los filtros de categoría solo deben aplicarse cuando NO se busca un slug específico.
        if (!empty($params['category_slug'])) {
            $args['category'] = array(sanitize_text_field($params['category_slug']));
        }

        if (!empty($params['category_exclude_slug'])) {
            $term = get_term_by('slug', sanitize_text_field($params['category_exclude_slug']), 'product_cat');
            if ($term) {
                // 'category__not_in' espera un array de IDs.
                $args['category__not_in'] = array($term->term_id);
            }
        }
    }

    if (!empty($params['orderby'])) {
        $args['orderby'] = sanitize_text_field($params['orderby']);
    }
    if (!empty($params['order'])) {
        $args['order'] = sanitize_text_field($params['order']);
    }

    $products = wc_get_products($args);

    $data = array();
    foreach ($products as $product_obj) {
        $product_data = $product_obj->get_data();
        
        $image_gallery_ids = $product_obj->get_gallery_image_ids();
        $images = [];
        if (has_post_thumbnail($product_obj->get_id())) {
             $main_image_id = get_post_thumbnail_id($product_obj->get_id());
             $main_image_url = wp_get_attachment_url($main_image_id);
             if ($main_image_url) {
                $images[] = array(
                    'id' => $main_image_id,
                    'src' => $main_image_url,
                    'alt' => get_post_meta($main_image_id, '_wp_attachment_image_alt', true),
                );
             }
        }
        foreach ($image_gallery_ids as $image_id) {
            $image_url = wp_get_attachment_url($image_id);
            if ($image_url) {
                $is_duplicate = false;
                foreach($images as $existing_image) {
                    if ($existing_image['id'] === $image_id) {
                        $is_duplicate = true;
                        break;
                    }
                }
                if (!$is_duplicate) {
                    $images[] = array(
                        'id' => $image_id,
                        'src' => $image_url,
                        'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                    );
                }
            }
        }
        $product_data['images'] = $images;

        $data[] = $product_data;
    }

    return new WP_REST_Response($data, 200);
}

/**
 * Función que maneja la petición para obtener una categoría por su slug.
 */
function morty_get_category_by_slug(WP_REST_Request $request) {
    $slug = $request->get_param('slug');

    if (empty($slug)) {
        return new WP_Error('no_slug_provided', 'No se ha proporcionado un slug de categoría.', array('status' => 400));
    }

    $term = get_term_by('slug', sanitize_text_field($slug), 'product_cat');

    if (!$term) {
        return new WP_Error('category_not_found', 'La categoría no se ha encontrado.', array('status' => 404));
    }
    
    $term_data = (array) $term;
    $term_data['id'] = $term->term_id;

    return new WP_REST_Response($term_data, 200);
}

?>
