<?php
add_theme_support('post-thumbnails');

function get_all_products_with_details($request) {
    $args = [
        'post_type' => 'product',
        'posts_per_page' => $request->get_param('per_page') ?: 100,
        'status' => 'publish',
    ];

    if ($slug = $request->get_param('slug')) {
        $args['name'] = $slug;
        $args['posts_per_page'] = 1;
    }

    if ($category_slug = $request->get_param('category_slug')) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => $category_slug,
            ],
        ];
    }
    
    if ($category_exclude_slug = $request->get_param('category_exclude_slug')) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => $category_exclude_slug,
                'operator' => 'NOT IN',
            ],
        ];
    }

    $products_query = new WP_Query($args);
    $products_data = [];

    if ($products_query->have_posts()) {
        while ($products_query->have_posts()) {
            $products_query->the_post();
            $product_id = get_the_ID();
            $product = wc_get_product($product_id);

            if (!$product) continue;

            $images = [];
            $attachment_ids = $product->get_gallery_image_ids();
            $attachment_ids[] = $product->get_image_id(); 
            $attachment_ids = array_unique(array_filter($attachment_ids));

            foreach ($attachment_ids as $attachment_id) {
                $image_url = wp_get_attachment_url($attachment_id);
                $image_alt = get_post_meta($attachment_id, '_wp_attachment_image_alt', true);
                $images[] = [
                    'id' => $attachment_id,
                    'src' => $image_url,
                    'alt' => $image_alt,
                ];
            }
            
            $reviews_query = new WP_Comment_Query([
                'post_id' => $product_id,
                'status' => 'approve',
                'type' => 'review'
            ]);
            $reviews = [];
            foreach ($reviews_query->comments as $comment) {
                $reviews[] = [
                    'id' => $comment->comment_ID,
                    'review' => $comment->comment_content,
                    'rating' => get_comment_meta($comment->comment_ID, 'rating', true),
                    'reviewer' => $comment->comment_author,
                    'reviewer_avatar_urls' => get_avatar_data($comment->comment_author_email),
                    'date_created' => $comment->comment_date
                ];
            }


            $product_data = [
                'id' => $product_id,
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'short_description' => $product->get_short_description(),
                'description' => $product->get_description(),
                'images' => $images,
                'average_rating' => (float) $product->get_average_rating(),
                'rating_count' => (int) $product->get_rating_count(),
                'category_names' => wc_get_product_category_list($product_id, ', ', '', ''),
                'sku' => $product->get_sku(),
                'tags' => wc_get_product_tag_list($product_id, ', ', '', ''),
                'attributes' => $product->get_attributes(),
                'reviews' => $reviews,
                'date_created' => $product->get_date_created(),
                'menu_order' => $product->get_menu_order(),
                'modified' => $product->get_date_modified()->date('c'),
            ];

            // Limpieza de campos para que sean strings
            $product_data['category_names'] = strip_tags($product_data['category_names']);
            $product_data['category_names'] = explode(', ', $product_data['category_names']);
            $product_data['tags'] = array_map(function($tag_html) {
                preg_match('/<a href="[^"]+" rel="tag">([^<]+)<\/a>/', $tag_html, $matches);
                return ['name' => $matches[1] ?? strip_tags($tag_html), 'slug' => ''];
            }, explode(', ', strip_tags($product_data['tags'], '<a>')));


            $attributes_array = [];
            foreach ($product->get_attributes() as $attribute) {
                 if ( is_a( $attribute, 'WC_Product_Attribute' ) ) {
                    $attributes_array[] = [
                        'name' => wc_attribute_label($attribute->get_name()),
                        'options' => $attribute->get_options()
                    ];
                }
            }
            $product_data['attributes'] = $attributes_array;


            $products_data[] = $product_data;
        }
        wp_reset_postdata();
    }

    return new WP_REST_Response($products_data, 200);
}


function register_custom_product_routes() {
    register_rest_route('morty/v1', '/products', [
        'methods' => 'GET',
        'callback' => 'get_all_products_with_details',
        'permission_callback' => '__return_true',
    ]);
}

add_action('rest_api_init', 'register_custom_product_routes');


// --- CÓDIGO AÑADIDO PARA EL BLOG ---
// Función para añadir la URL de la imagen destacada a la API de entradas
function add_featured_image_to_posts_api($data, $post, $request) {
    if (isset($post->ID) && has_post_thumbnail($post->ID)) {
        $featured_image_id = get_post_thumbnail_id($post->ID);
        // Usamos 'large' para un buen balance entre calidad y tamaño de archivo
        $featured_image_url = wp_get_attachment_image_url($featured_image_id, 'large');
        $data->data['featured_image_url'] = $featured_image_url;
    } else {
        $data->data['featured_image_url'] = null; // No hay imagen destacada
    }
    return $data;
}

// Enganchar la función al hook de la API REST para las entradas
add_filter('rest_prepare_post', 'add_featured_image_to_posts_api', 10, 3);
// --- FIN DEL CÓDIGO AÑADIDO ---
?>
