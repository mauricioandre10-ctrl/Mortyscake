<?php
// Este archivo es un placeholder para futuras funciones de WordPress.
// No tiene un efecto real en tu sitio de WordPress.
// Para hacer cambios, debes editar el archivo functions.php de tu tema de WordPress directamente.

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