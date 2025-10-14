
import { MetadataRoute } from 'next';

interface Product {
  id: number;
  slug: string;
  modified: string; // La fecha de última modificación
  category_names: string[];
}

interface Post {
    slug: string;
    modified: string;
}

// Función para obtener todos los productos y cursos de la API
async function getAllProducts(): Promise<Product[]> {
    const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
    if (!apiUrl) {
        console.error("[Sitemap] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_API_URL no está configurada.");
        return [];
    }
    try {
        const url = new URL(`${apiUrl}/wp-json/morty/v1/products`);
        url.searchParams.set('per_page', '100');
        
        const response = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Revalidar cada hora
        
        if (!response.ok) {
            console.error(`[Sitemap] Failed to fetch products. Status: ${response.status}`);
            return [];
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error(`[Sitemap] Expected application/json but received ${contentType}`);
            const text = await response.text();
            console.error(`[Sitemap] Response text: ${text.substring(0, 200)}...`);
            return [];
        }
        
        const data = await response.json();
        return data;

    } catch (err) {
        console.error('[Sitemap] An unexpected error occurred:', err);
        return [];
    }
}

// Función para obtener todos los posts del blog
async function getAllPosts(): Promise<Post[]> {
    const apiUrl = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
    if (!apiUrl) {
        console.error("[Sitemap] Error: La variable de entorno NEXT_PUBLIC_WOOCOMMERCE_API_URL no está configurada.");
        return [];
    }
    try {
        const url = new URL(`${apiUrl}/wp-json/wp/v2/posts`);
        url.searchParams.set('per_page', '100');
        
        const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
        
        if (!response.ok) {
            console.error(`[Sitemap] Failed to fetch posts. Status: ${response.status}`);
            return [];
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error(`[Sitemap] Expected application/json but received ${contentType}`);
            const text = await response.text();
            console.error(`[Sitemap] Response text: ${text.substring(0, 200)}...`);
            return [];
        }

        const data: Post[] = await response.json();
        return data;

    } catch (err) {
        console.error('[Sitemap] An unexpected error occurred fetching posts:', err);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://mortyscake.com';
  
  const allProducts = await getAllProducts();
  const allPosts = await getAllPosts();

  const courses = allProducts
    .filter(product => product.category_names.includes('Cursos'))
    .map((course) => ({
      url: `${siteUrl}/courses/${course.slug}`,
      lastModified: course.modified ? new Date(course.modified) : new Date(),
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.8,
    }));

  const products = allProducts
    .filter(product => !product.category_names.includes('Cursos'))
    .map((product) => ({
      url: `${siteUrl}/shop/${product.slug}`,
      lastModified: product.modified ? new Date(product.modified) : new Date(),
      changeFrequency: 'weekly' as 'weekly',
      priority: 0.7,
    }));

  const posts = allPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.modified ? new Date(post.modified) : new Date(),
    changeFrequency: 'monthly' as 'monthly',
    priority: 0.6,
  }));


  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
     {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/legal/cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [
    ...staticPages,
    ...courses,
    ...products,
    ...posts,
  ];
}
