
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, User } from 'lucide-react';
import Link from 'next/link';
import { apiUrl } from '@/lib/config';

interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  featured_image_url: string | null;
  date: string;
  modified: string;
  author_name: string;
  author_avatar: string;
}

// Función para obtener los datos de una entrada específica
async function getPost(slug: string): Promise<Post | null> {
    if (!apiUrl) {
        console.error("[SERVER] Error: La variable de entorno NEXT_PUBLIC_API_URL no está configurada.");
        return null;
    }

    try {
        const url = new URL(`${apiUrl}/wp-json/wp/v2/posts`);
        url.searchParams.set('slug', slug);
        url.searchParams.set('_embed', 'author'); // Incluir datos del autor

        const response = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Revalidar cada hora
        
        if (!response.ok) {
            console.error(`[SERVER] Failed to fetch post. Status: ${response.status}`);
            return null;
        }
        
        const posts = await response.json();
        if (posts.length === 0) {
            return null;
        }

        const postData = posts[0];
        
        // Estructurar la respuesta
        const post: Post = {
          id: postData.id,
          slug: postData.slug,
          title: postData.title,
          content: postData.content,
          excerpt: postData.excerpt,
          featured_image_url: postData.featured_image_url || null,
          date: postData.date,
          modified: postData.modified,
          author_name: postData._embedded?.author?.[0]?.name || 'Morty\'s Cake',
          author_avatar: postData._embedded?.author?.[0]?.avatar_urls?.['96'] || '/image/Logo_mortys_cake.webp'
        };

        return post;
    } catch (err) {
        console.error('[SERVER] An unexpected error occurred:', err);
        return null;
    }
}

// Generar metadatos para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Entrada no encontrada',
      description: 'La entrada del blog que buscas no existe o no está disponible.',
    };
  }

  // Limpiar el excerpt de etiquetas HTML para la descripción
  const cleanDescription = post.excerpt.rendered.replace(/<[^>]*>?/gm, '');

  return {
    title: post.title.rendered,
    description: cleanDescription,
    openGraph: {
      title: post.title.rendered,
      description: cleanDescription,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author_name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: cleanDescription,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

// Página de la entrada del blog
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const postDate = format(new Date(post.date), "d 'de' MMMM 'de' yyyy", { locale: es });

  return (
    <article className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
        <div className="mb-8">
            <Button asChild variant="outline" size="sm">
                <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Blog
                </Link>
            </Button>
      </div>

      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl mb-4">{post.title.rendered}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Image src={post.author_avatar} alt={post.author_name} width={24} height={24} className="rounded-full" />
                <span>{post.author_name}</span>
            </div>
            <span className="text-muted-foreground/50">|</span>
            <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={post.date}>{postDate}</time>
            </div>
        </div>
      </header>

      {post.featured_image_url && (
        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-8 shadow-lg">
          <Image
            src={post.featured_image_url}
            alt={post.title.rendered}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert lg:prose-xl mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
