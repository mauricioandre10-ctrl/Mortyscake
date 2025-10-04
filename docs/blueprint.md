# **App Name**: Morty's Cake

## Core Features:

- Course Catalog: Display a catalog of available pastry courses with descriptions, schedules, and pricing.
- Subscription Management: Allow users to subscribe and manage their course subscriptions.
- Payment Integration: Integrate with Shopify or WooCommerce to handle payments and subscriptions. The app will redirect to these payment portals.
- User Account: Users can create accounts, log in, and manage their profile information.
- Responsive Design: Ensure the application is responsive and works well on different devices (desktop, tablet, mobile).

## Style Guidelines:

- Primary color: Muted rose (#D87093), evoking a warm, gourmand feel.
- Background color:  (#513938), .
- Accent color: Muted coral (#F08080), providing a vibrant highlight.
- Body and headline font: 'Alegreya', a serif typeface that conveys an elegant, intellectual, contemporary feel.
- Use custom-designed icons related to baking and pastry, with a hand-drawn or artisanal aesthetic.
- Employ a clean, minimalist layout that highlights the pastry courses and makes navigation intuitive.

## Objetivo:
Diseñar y desarrollar una web profesional, moderna y responsive con Next.js + React, exportada de forma estática (SSG). La web funcionará como tienda e‑commerce y plataforma de cursos, gestionada desde WordPress + WooCommerce (y un plugin LMS como Sensei o LearnDash). El frontend debe mantener la paleta de colores actual, con un diseño atractivo, limpio y contemporáneo.

Tecn stack:
- Next.js 14 (App Router) + React 18
- Exportación estática con `next export`
- Tailwind CSS para estilos
- Framer Motion para animaciones sutiles
- Integración con WordPress/WooCommerce vía REST API o GraphQL (WPGraphQL)
- SEO optimizado (Next SEO, sitemap, Open Graph, schema.org)
- Accesibilidad AA (roles ARIA, navegación por teclado, contraste)

Diseño:
- Mantener gama de colores actual (definir tokens CSS: --color-primary, --color-secondary, --color-accent)
- Tipografía moderna (ej. Inter, Outfit o Poppins)
- Layout limpio, con espacios generosos, tarjetas con sombras suaves, esquinas redondeadas
- Modo oscuro opcional
- Estilo profesional y actual, con énfasis en usabilidad y conversión

Páginas principales:
- Home: hero con CTA, grid de categorías (Productos, Cursos), destacados, testimonios, blog
- Tienda (/shop): listado de productos con filtros (categoría, precio, rating)
- Producto (/product/[slug]): galería, descripción, reseñas, productos relacionados
- Carrito y Checkout: carrito persistente, checkout redirigido a WooCommerce
- Cursos (/courses): listado de cursos con filtros (nivel, duración, precio)
- Curso (/courses/[slug]): temario, lecciones, CTA comprar o continuar curso
- Cuenta (/account): perfil, pedidos, cursos adquiridos
- Blog (/blog, /blog/[slug]): posts desde WordPress
- Páginas legales: privacidad, términos, cookies

Componentes clave:
- Header con navegación sticky y buscador global
- Mini‑carrito en el header
- Cards reutilizables para productos y cursos
- Filtros accesibles con query params
- Breadcrumbs SEO
- Loader skeletons y toasts para feedback

Integración con WordPress:
- WooCommerce gestiona productos, pedidos y pagos
- LMS (Sensei/LearnDash) gestiona cursos y lecciones
- El frontend consume datos vía REST API/GraphQL y los renderiza estáticamente
- ISR o regeneración estática para mantener contenido actualizado

Rendimiento:
- Imágenes optimizadas con next/image
- Lazy load en listas largas
- Lighthouse 95+ en móvil y desktop
- LCP < 2.5s, CLS < 0.1

Entrega:
- Proyecto Next.js listo para build y export estático
- Variables de entorno documentadas (.env.example)
- Documentación de cómo conectar WordPress/WooCommerce
- Tokens de color y tipografía definidos en Tailwind config