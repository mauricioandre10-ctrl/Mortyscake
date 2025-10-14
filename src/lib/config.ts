// src/lib/config.ts

// Lee la variable de entorno una sola vez y la exporta para ser usada en toda la aplicación.
// Esto asegura que Next.js la procese correctamente y la incluya en el bundle del cliente.
export const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
