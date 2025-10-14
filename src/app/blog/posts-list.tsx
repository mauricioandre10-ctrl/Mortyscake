
'use client';

import Image from 'next/image';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { apiUrl } from '@/lib/config';

interface Post {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_image_url: string | null;
  date: string;
}

function PostCard({ post }: { post: Post }) {
  const postDate = format(new Date(post.date), "d 'de' MMMM 'de' yyyy", { locale: es });
  
  return (
    <Card className="overflow-hidden group shadow-md hover:shadow-primary/20 hover:shadow-xl transition-shadow duration-300">
      <Link href={`/blog/${post.slug}`} className="block h-full flex flex-col">
        <div className="relative aspect-[16/9] bg-muted overflow-hidden rounded-t-lg">
          {post.featured_image_url ? (
            <Image 
                src={post.featured_image_url}
                alt={`Imagen para ${post.title.rendered}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
             <div className="w-full h-full bg-muted"></div>
          )}
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <CardTitle className="font-card-title text-xl mt-2">{post.title.rendered}</CardTitle>
           <p className="text-sm text-muted-foreground mt-2 mb-4">{postDate}</p>
          <div className="text-muted-foreground text-sm flex-grow" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </CardContent>
      </Link>
    </Card>
  );
}

export function PostsList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPosts() {
            if (!apiUrl) {
                setError('La configuración del sitio no es correcta.');
                setLoading(false);
                return;
            }
        
            try {
                // El parámetro _embed puede ser útil para obtener info del autor o categorías.
                const postsApiUrl = new URL(`${apiUrl}/wp-json/wp/v2/posts?_embed`);
                const response = await fetch(postsApiUrl.toString(), {
                  signal: AbortSignal.timeout(30000), // 30-second timeout
                  next: { revalidate: 3600 } // Revalidate every hour
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch posts: ${response.statusText}`);
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                console.error('[CLIENT] An unexpected error occurred:', err);
                setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
            } finally {
                setLoading(false);
            }
        }
        
        fetchPosts();
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return <p className="text-center text-destructive col-span-full">Error al cargar las entradas: {error}</p>;
    }

    if (posts.length === 0) {
        return <p className="text-center text-muted-foreground col-span-full">No hay entradas en el blog por el momento.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {posts.map((post: Post) => (
             <PostCard key={post.id} post={post} />
          ))}
        </div>
    );
}

function LoadingSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <Skeleton className="aspect-[16/9] w-full" />
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
}
