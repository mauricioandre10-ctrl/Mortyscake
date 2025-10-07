
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductDetailPageSkeleton() {
    return (
       <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="mb-8">
            <Skeleton className="h-6 w-32" />
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
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-10 w-1/3" />
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
      </div>
    );
}
