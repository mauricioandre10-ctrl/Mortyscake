<?php
/**
 * CÓDIGO PARA AÑADIR AL `functions.php` DE TU TEMA HIJO EN WORDPRESS.
 *
 * INSTRUCCIONES:
 * 1. Accede a tu panel de WordPress.
 * 2. Ve a Apariencia > Editor de archivos de temas.
 * 3. Asegúrate de tener seleccionado tu tema hijo (child theme). Si no tienes un tema hijo, es MUY recomendable crear uno para no perder estos cambios al actualizar el tema principal.
 * 4. Busca y haz clic en el archivo `functions.php` (Funciones del Tema).
 * 5. Copia TODO el código que hay debajo de esta línea y pégalo al final del archivo `functions.php`.
 * 6. Guarda los cambios.
 *
 * ¿QUÉ HACE ESTE CÓDIGO?
 * Este código crea unas "rutas" o "endpoints" personalizados en la API REST de WordPress.
 * La aplicación de Next.js que hemos construido consultará estas rutas para obtener la información de los productos y categorías de WooCommerce de forma segura, sin exponer tus claves de API.
 *
 * Las rutas que se crearán son:
 * - /wp-json/morty/v1/products: Para obtener una lista de productos. Acepta parámetros como `slug`, `category`, `per_page`, `exclude`, etc.
 * - /wp-json/morty/v1/category-by-slug: Para obtener los detalles de una categoría a partir de su slug (ej: "cursos").
 */

add_action('rest_api_init', function () {
    // Endpoint para obtener productos con varios filtros
    register_rest_route('morty/v1', '/products', array(
        'methods' => 'GET',
        'callback' => 'morty_get_products',
        'permission_callback' => '__return_true' // Abierto para lectura
    ));

    // Endpoint para obtener una categoría por su slug
    register_rest_route('morty/v1', '/category-by-slug', array(
        'methods' => 'GET',
        'callback' => 'morty_get_category_by_slug',
        'permission_callback' => '__return_true' // Abierto para lectura
    ));
});

/**
 * Función que maneja la petición para obtener productos de WooCommerce.
 *
 * @param WP_REST_Request $request Objeto de la petición.
 * @return WP_REST_Response|WP_Error
 */
function morty_get_products(WP_REST_Request $request) {
    // Permitir peticiones desde cualquier origen (solución CORS)
    header("Access-Control-Allow-Origin: *");
    
    if (!class_exists('WooCommerce')) {
        return new WP_Error('woocommerce_not_active', 'WooCommerce no está activado.', array('status' => 500));
    }

    $params = $request->get_params();
    $args = array(
        'status' => 'publish', // Solo productos publicados
        'limit' => isset($params['per_page']) ? intval($params['per_page']) : 10,
        'paginate' => false,
    );

    // Filtrar por slug
    if (!empty($params['slug'])) {
        $args['slug'] = sanitize_text_field($params['slug']);
    }

    // Filtrar por categoría (ID)
    if (!empty($params['category'])) {
        $args['category'] = array(sanitize_text_field($params['category']));
    }

    // Excluir productos por ID
    if (!empty($params['exclude'])) {
       $exclude_ids = explode(',', sanitize_text_field($params['exclude']));
       $args['exclude'] = array_map('intval', $exclude_ids);
    }
    
    // Excluir productos por ID de categoría
    if (!empty($params['category_exclude'])) {
        $category_ids_to_exclude = array_map('intval', explode(',', sanitize_text_field($params['category_exclude'])));
        
        $products_to_exclude = wc_get_products(array(
            'category' => $category_ids_to_exclude,
            'limit' => -1,
            'return' => 'ids',
        ));

        if (!empty($products_to_exclude)) {
            $args['exclude'] = array_merge(isset($args['exclude']) ? $args['exclude'] : array(), $products_to_exclude);
        }
    }
    
    // Orden
    if (!empty($params['orderby'])) {
        $args['orderby'] = sanitize_text_field($params['orderby']); // ej: 'date', 'price', 'popularity'
    }
    if (!empty($params['order'])) {
        $args['order'] = sanitize_text_field($params['order']); // 'ASC' o 'DESC'
    }

    $products = wc_get_products($args);

    $data = array();
    foreach ($products as $product_obj) {
        $data[] = $product_obj->get_data();
    }

    return new WP_REST_Response($data, 200);
}

/**
 * Función que maneja la petición para obtener una categoría por su slug.
 *
 * @param WP_REST_Request $request Objeto de la petición.
 * @return WP_REST_Response|WP_Error
 */
function morty_get_category_by_slug(WP_REST_Request $request) {
    // Permitir peticiones desde cualquier origen (solución CORS)
    header("Access-Control-Allow-Origin: *");

    $slug = $request->get_param('slug');

    if (empty($slug)) {
        return new WP_Error('no_slug_provided', 'No se ha proporcionado un slug de categoría.', array('status' => 400));
    }

    $term = get_term_by('slug', sanitize_text_field($slug), 'product_cat');

    if (!$term) {
        return new WP_Error('category_not_found', 'La categoría no se ha encontrado.', array('status' => 404));
    }

    return new WP_REST_Response($term, 200);
}

?>
    