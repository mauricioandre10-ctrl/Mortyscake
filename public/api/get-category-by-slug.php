<?php
// Carga el autoloader de Composer. Asegúrate de haber ejecutado `composer require automattic/woocommerce` en tu servidor.
require __DIR__ . '/vendor/autoload.php';

use Automattic\WooCommerce\Client;

// --- CONFIGURACIÓN ---
// Reemplaza con la URL de tu tienda y tus claves de API de WooCommerce.
$site_url = 'https://tecnovacenter.shop';
$consumer_key = 'ck_67b089d0427cd989adc74aae4f6ebfa518ca3612'; // ¡REEMPLAZA ESTO!
$consumer_secret = 'cs_ffa2b6242d8ba6022d240036e801bc9b7f408c6f'; // ¡REEMPLAZA ESTO!
// -------------------

// Configura CORS y el tipo de contenido
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Verifica si se proporcionó un slug de categoría
if (!isset($_GET['slug'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'El parámetro "slug" es obligatorio.']);
    exit;
}

// Inicializa el cliente de WooCommerce
$woocommerce = new Client(
    $site_url,
    $consumer_key,
    $consumer_secret,
    [
        'version' => 'wc/v3',
    ]
);

try {
    // Obtiene el slug del parámetro de la URL
    $slug = sanitize_text_field($_GET['slug']);

    // Busca la categoría por su slug
    $categories = $woocommerce->get('products/categories', ['slug' => $slug]);

    if (empty($categories)) {
        http_response_code(404); // Not Found
        echo json_encode(['error' => 'No se encontró ninguna categoría con el slug: ' . $slug]);
    } else {
        // Devuelve la primera categoría encontrada (los slugs son únicos)
        echo json_encode($categories);
    }

} catch (Exception $e) {
    // Si algo sale mal, devuelve un error 500
    http_response_code(500);
    echo json_encode(['error' => 'Error al contactar con la API de WooCommerce: ' . $e->getMessage()]);
}

// Función simple para sanitizar, similar a la de WordPress
function sanitize_text_field($str) {
    $filtered = trim($str);
    $filtered = strip_tags($filtered);
    $filtered = htmlspecialchars($filtered, ENT_QUOTES, 'UTF-8');
    return $filtered;
}
?>
