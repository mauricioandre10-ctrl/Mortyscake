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
        // Lista de dominios permitidos
        $allowed_origins = [
            'https://mortyscake-website-abkn0i9ut-mauricio-s-projects-bb335663.vercel.app',
            'https://mortyscake.com', // Tu dominio final
            'http://localhost:9002', // Para desarrollo local
        ];
        
        $origin = get_http_origin();
        if ( $origin && in_array( $origin, $allowed_origins ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
        } else {
            // Como fallback, podemos mantener el comodín o un dominio por defecto.
            // Para producción, es más seguro especificar dominios.
            header( 'Access-control-allow-origin: *' );
        }

        header( 'Access-Control-Allow-Methods: GET, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce' );
        header( 'Access-Control-Allow-Credentials: true' );

        // Responder a solicitudes OPTIONS pre-vuelo
        if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
            status_header( 200 );
            exit();
        }

        return $value;
    });
}, 15 );


// Registra el endpoint personalizado en la API de WordPress
add_action('rest_api_init', function () {
    register_rest_route('morty/v1', '/products', array(
        'methods' => 'GET',
        'callback' => 'morty_get_products_with_details',
        'permission_callback' => '__return_true'
    ));
});

/**
 * Función robusta y simplificada para obtener productos de WooCommerce.
 * - Prioriza la búsqueda por 'slug' si se proporciona.
 * - Filtra por categoría (para 'cursos').
 * - Excluye una categoría (para 'productos').
 * - Siempre devuelve nombres de categorías, SKU, etiquetas y atributos.
 */
function morty_get_products_with_details(WP_REST_Request $request) {
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_not_active', 'WooCommerce no está activado.', array('status' => 500));
    }

    $params = $request->get_params();
    $products = [];

    // Prioridad 1: Si se pasa un 'slug', buscar ese producto específico.
    if (!empty($params['slug'])) {
        $product_query = new WP_Query(array(
            'post_type' => 'product',
            'name' => sanitize_text_field($params['slug']),
            'posts_per_page' => 1
        ));
        if ($product_query->have_posts()) {
            while ($product_query->have_posts()) {
                $product_query->the_post();
                $product_obj = wc_get_product(get_the_ID());
                if ($product_obj) {
                    $products[] = $product_obj;
                }
            }
        }
        wp_reset_postdata();
    } 
    // Prioridad 2: Si no hay slug, aplicar filtros de categoría para listas.
    else {
        $args = array(
            'status' => 'publish',
            'limit' => isset($params['per_page']) ? intval($params['per_page']) : 10,
            'paginate' => false,
        );

        // Para obtener solo productos de una categoría específica (ej: 'cursos')
        if (!empty($params['category_slug'])) {
            $args['category'] = array(sanitize_text_field($params['category_slug']));
        }
        
        // Para excluir una categoría (ej: 'cursos' de la tienda principal)
        if (!empty($params['category_exclude_slug'])) {
            $term = get_term_by('slug', sanitize_text_field($params['category_exclude_slug']), 'product_cat');
            if ($term) {
                $args['category__not_in'] = array($term->term_id);
            }
        }
        $products = wc_get_products($args);
    }
    
    $data = array();
    foreach ($products as $product_obj) {
        if (!$product_obj) continue;

        $product_data = $product_obj->get_data();
        
        // Obtener nombres de las categorías y añadirlos a la respuesta
        $category_objects = get_the_terms($product_obj->get_id(), 'product_cat');
        $category_names = [];
        if (!empty($category_objects) && !is_wp_error($category_objects)) {
            $category_names = wp_list_pluck($category_objects, 'name');
        }
        $product_data['category_names'] = $category_names;

        // Obtener etiquetas (tags)
        $tag_objects = get_the_terms($product_obj->get_id(), 'product_tag');
        $tags = [];
        if (!empty($tag_objects) && !is_wp_error($tag_objects)) {
            foreach ($tag_objects as $tag) {
                $tags[] = ['name' => $tag->name, 'slug' => $tag->slug];
            }
        }
        $product_data['tags'] = $tags;

        // Obtener atributos visibles
        $attributes_data = [];
        $attributes = $product_obj->get_attributes();
        foreach ($attributes as $attribute) {
            if ($attribute->get_visible()) {
                $attributes_data[] = [
                    'name' => $attribute->get_name(),
                    'options' => $attribute->get_options(),
                ];
            }
        }
        $product_data['attributes'] = $attributes_data;


        // Obtener todas las imágenes (destacada + galería)
        $images = [];
        $main_image_id = $product_obj->get_image_id();
        if ($main_image_id) {
            $main_image_url = wp_get_attachment_url($main_image_id);
            if ($main_image_url) {
                $images[] = array(
                    'id' => intval($main_image_id),
                    'src' => $main_image_url,
                    'alt' => get_post_meta($main_image_id, '_wp_attachment_image_alt', true),
                );
            }
        }

        $gallery_image_ids = $product_obj->get_gallery_image_ids();
        foreach ($gallery_image_ids as $image_id) {
            $image_id = intval($image_id);
            if ($image_id !== intval($main_image_id)) { // Evita duplicar la imagen destacada si también está en la galería
                $image_url = wp_get_attachment_url($image_id);
                if ($image_url) {
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
?>
