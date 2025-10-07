
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import CourseClientPage from './CourseClientPage';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';


const WP_API_URL = 'https://mortyscake.com';

// This tells Next.js to generate pages on-demand if they weren't generated at build time.
export const dynamicParams = true;

// This function can return an empty array if we want to build all pages on-demand.
// This makes the build process independent of the API's availability.
export async function generateStaticParams() {
  return [];
}

async function getCourse(slug: string) {
  // During build, don't fetch data. Data will be fetched on the client.
  if (process.env.npm_lifecycle_event === 'build') {
    return null;
  }
  try {
    const response = await fetch(`${WP_API_URL}/wp-json/morty/v1/products?slug=${slug}`, { next: { revalidate: 3600 } }); // Revalidate every hour
     if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch initial course product from API", error);
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);

  // The notFound() call is now handled inside the Client Component after client-side fetching.
  // if (!course) {
  //   notFound();
  // }

  return (
    <Suspense fallback={<CourseDetailPageSkeleton />}>
        <CourseClientPage initialCourse={course} slug={params.slug} />
    </Suspense>
  );
}


function CourseDetailPageSkeleton() {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
            <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-1/4" />
                            <Skeleton className="h-12 w-1/3" />
                        </div>
                        <Skeleton className="h-12 w-full" />
                         <div className="border-t pt-4 space-y-3 text-sm">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
         <div className="max-w-6xl mx-auto mt-16 pt-8 border-t">
            <Skeleton className="h-10 w-1/2 mx-auto mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
      </div>
    );
}
