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

// Configura CORS para permitir peticiones desde tu dominio de frontend.
// En producción, es más seguro reemplazar '*' por tu dominio real (ej. 'https://tu-tienda-nextjs.com').
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Inicializa el cliente de WooCommerce
$woocommerce = new Client(
    $site_url,
    $consumer_key,
    $consumer_secret,
    [
        'version' => 'wc/v3',
        'timeout' => 30, // Aumenta el tiempo de espera si es necesario
    ]
);

try {
    // Recoge todos los parámetros de la URL (ej. ?slug=mi-curso, ?category=123, ?per_page=10)
    // Esto hace que el script sea muy flexible.
    $params = $_GET;

    // Llama a la API de WooCommerce con los parámetros proporcionados
    $products = $woocommerce->get('products', $params);

    // Devuelve los productos como JSON
    echo json_encode($products);

} catch (Exception $e) {
    // Si algo sale mal, devuelve un error 500 con el mensaje del error.
    http_response_code(500);
    echo json_encode(['error' => 'Error al contactar con la API de WooCommerce: ' . $e->getMessage()]);
}
?>
