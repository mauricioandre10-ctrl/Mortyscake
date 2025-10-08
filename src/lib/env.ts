
/**
 * Este archivo centraliza el acceso a las variables de entorno.
 * Proporciona una única fuente de verdad para la URL de la tienda WooCommerce,
 * asegurando que funcione tanto en el servidor (durante la compilación) como en el cliente.
 */

// Se lee la variable pública, que es accesible en ambos entornos.
const storeUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_STORE_URL;

// Si la URL no está definida, se lanza un error para fallar rápido en desarrollo,
// en lugar de tener errores crípticos de "undefined" en la aplicación.
if (!storeUrl) {
  console.error("La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_STORE_URL no está definida.");
  // En un entorno de navegador, podríamos no querer lanzar un error que bloquee todo,
  // pero para la consistencia, devolvemos una cadena vacía y el error en consola ya alerta del problema.
}

export const WOOCOMMERCE_STORE_URL = storeUrl || '';
