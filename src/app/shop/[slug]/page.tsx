
import { Suspense } from 'react';
import ProductClientPage from './ProductClientPage';
import ProductDetailPageSkeleton from './ProductDetailPageSkeleton';

type ProductDetailPageProps = {
  params: { slug: string };
};

// La obtención de datos del lado del servidor ha sido eliminada.
// El componente cliente se encargará de toda la lógica de carga.
export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Siempre pasamos `null` para `initialProduct`.
  // El componente cliente (`ProductClientPage`) está diseñado para
  // obtener los datos en el navegador si `initialProduct` es `null`.
  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
        <ProductClientPage initialProduct={null} slug={params.slug} />
    </Suspense>
  );
}
