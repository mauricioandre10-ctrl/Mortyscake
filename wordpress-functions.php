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


// Registra el endpoint personalizado en la API de WordPress
add_action('rest_api_init', function () {
    register_rest_route('morty/v1', '/products', array(
        'methods' => 'GET',
        'callback' => 'morty_get_products',
        'permission_callback' => '__return_true'
    ));
});

/**
 * Función robusta y simplificada para obtener productos de WooCommerce.
 * - Prioriza la búsqueda por slug para las páginas de detalle.
 * - Maneja correctamente la inclusión/exclusión de categorías por slug.
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

    // Prioridad 1: Si se pasa un 'slug', buscar ese producto específico.
    if (!empty($params['slug'])) {
        $args['slug'] = sanitize_text_field($params['slug']);
        $args['limit'] = 1; // Un slug debe devolver un único producto.
    } 
    // Prioridad 2: Si no hay slug, aplicar filtros de categoría.
    else {
        // Para obtener solo productos de una categoría específica (ej: 'cursos')
        if (!empty($params['category_slug'])) {
            $args['category'] = array(sanitize_text_field($params['category_slug']));
        }
        
        // Para excluir una categoría (ej: 'cursos' de la tienda principal)
        if (!empty($params['category_exclude_slug'])) {
            $term = get_term_by('slug', sanitize_text_field($params['category_exclude_slug']), 'product_cat');
            // Si la categoría existe, usamos su ID para excluirla.
            if ($term) {
                $args['category__not_in'] = array($term->term_id);
            }
        }
    }

    // Ordenación (opcional, se puede añadir si es necesario)
    if (!empty($params['orderby'])) {
        $args['orderby'] = sanitize_text_field($params['orderby']);
    }
    if (!empty($params['order'])) {
        $args['order'] = sanitize_text_field($params['order']);
    }

    // Obtener los productos usando los argumentos construidos
    $products = wc_get_products($args);

    // Formatear los datos para la respuesta JSON
    $data = array();
    foreach ($products as $product_obj) {
        $product_data = $product_obj->get_data();
        
        // Obtener todas las imágenes (destacada + galería)
        $image_gallery_ids = $product_obj->get_gallery_image_ids();
        $images = [];
        
        // Añadir la imagen destacada primero
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
        
        // Añadir las imágenes de la galería, evitando duplicados
        foreach ($image_gallery_ids as $image_id) {
            $image_url = wp_get_attachment_url($image_id);
            if ($image_url) {
                // Comprobamos si la imagen ya ha sido añadida (como imagen destacada)
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
        
        // Sobrescribir el campo de imágenes con nuestra lista completa
        $product_data['images'] = $images;

        // Añadir los nombres de las categorías a la respuesta para facilitar el debugging
        $category_objects = get_the_terms($product_obj->get_id(), 'product_cat');
        $category_names = [];
        if (!empty($category_objects)) {
            foreach ($category_objects as $cat) {
                $category_names[] = $cat->name;
            }
        }
        $product_data['category_names'] = $category_names;


        $data[] = $product_data;
    }

    return new WP_REST_Response($data, 200);
}
?>
