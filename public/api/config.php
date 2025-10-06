<?php
// Habilitar CORS para permitir peticiones desde cualquier origen.
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// --- CONEXIÓN A LA BASE DE DATOS WORDPRESS EN IONOS ---
//
// Instrucciones:
// Reemplaza los siguientes marcadores de posición con las credenciales de tu base de datos.
// Puedes encontrar estos datos en tu panel de control de Ionos, en la sección "Bases de datos".

/**
 * El nombre del host de tu base de datos.
 * Suele ser algo como 'db123456789.hosting-data.io'.
 */
define('DB_HOST', 'REEMPLAZA_CON_TU_HOST_DE_BD');

/**
 * El nombre de usuario para tu base de datos.
 * Suele ser algo como 'dbo123456789'.
 */
define('DB_USER', 'REEMPLAZA_CON_TU_USUARIO_DE_BD');

/**
 * La contraseña para tu base de datos.
 */
define('DB_PASSWORD', 'REEMPLAZA_CON_TU_CONTRASEÑA_DE_BD');

/**
 * El nombre de la base de datos.
 * Suele ser algo como 'db123456789'.
 */
define('DB_NAME', 'REEMPLAZA_CON_TU_NOMBRE_DE_BD');

// Crear la conexión a la base de datos.
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);

// Verificar si la conexión ha fallado.
if ($conn->connect_error) {
    // Detener la ejecución y devolver un error 500 (Error Interno del Servidor).
    http_response_code(500);
    echo json_encode(
        array("error" => "Error de conexión a la base de datos: " . $conn->connect_error)
    );
    // Detiene la ejecución del script.
    die();
}

// Establecer el juego de caracteres a UTF-8 para una correcta codificación.
if (!$conn->set_charset("utf8")) {
    // Opcional: puedes registrar un error si la codificación falla.
    // error_log("Error al establecer el charset a utf8: " . $conn->error);
}

// Si este archivo se incluye en otros scripts, la variable $conn estará disponible
// para realizar consultas a la base de datos.
?>
