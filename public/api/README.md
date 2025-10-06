# Instrucciones para la API de PHP en Ionos

Estos archivos PHP actúan como un intermediario seguro entre tu sitio web estático y la API de WooCommerce de WordPress.

## Pasos para la configuración en tu hosting de Ionos:

### 1. Reemplaza tus credenciales

En los archivos `get-products.php` y `get-category-by-slug.php`, busca las siguientes líneas y reemplaza los valores de marcador de posición por tus credenciales reales de WooCommerce:

```php
$site_url = 'https://tecnovacenter.shop'; // La URL de tu tienda
$consumer_key = 'ck_...'; // Tu Consumer Key real
$consumer_secret = 'cs_...'; // Tu Consumer Secret real
```

**¡MUY IMPORTANTE!** Nunca expongas estas claves en el código del lado del cliente (JavaScript). El propósito de estos archivos PHP es precisamente mantenerlas seguras en el servidor.

### 2. Instala la librería de WooCommerce

Estos scripts dependen de la librería oficial de WooCommerce para PHP. Para instalarla, necesitarás acceso a la línea de comandos (SSH) en tu hosting de Ionos y tener [Composer](https://getcomposer.org/) instalado.

Una vez conectado por SSH, navega a esta carpeta (`/api/`) y ejecuta el siguiente comando:

```bash
composer require automattic/woocommerce
```

Esto creará una carpeta `vendor` y un archivo `vendor/autoload.php` que los scripts ya están configurados para usar.

Si no tienes acceso a la línea de comandos, puedes:
a. Instalar Composer localmente en tu ordenador.
b. Crear un nuevo proyecto (`mkdir mi_api && cd mi_api`).
c. Ejecutar `composer require automattic/woocommerce`.
d. Subir la carpeta `vendor` generada a este directorio `/api/` en tu hosting a través de FTP.

### 3. Prueba los Endpoints

Una vez que hayas subido los archivos, configurado las claves e instalado las dependencias, puedes probarlos directamente en tu navegador:

-   **Para obtener todos los productos:** `https://<tu-dominio>/api/get-products.php`
-   **Para obtener un producto específico:** `https://<tu-dominio>/api/get-products.php?slug=nombre-del-producto`
-   **Para obtener la categoría "cursos":** `https://<tu-dominio>/api/get-category-by-slug.php?slug=cursos`

Si todo está configurado correctamente, deberías ver los datos en formato JSON en tu navegador. ¡Tu frontend ya está listo para consumir estos datos!
