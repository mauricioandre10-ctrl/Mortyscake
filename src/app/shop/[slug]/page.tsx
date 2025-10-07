
import { Suspense } from 'react';
import ProductClientPage from './ProductClientPage';
import ProductDetailPageSkeleton from './ProductDetailPageSkeleton';

// Esta función es necesaria para la exportación estática (`output: 'export'`).
// Al devolver un array vacío, le indicamos a Next.js que no pre-genere
// ninguna página de detalle de producto durante la compilación. La carga de datos
// se hará completamente en el lado del cliente.
export async function generateStaticParams() {
  return [];
}

// La obtención de datos del lado del servidor ha sido eliminada.
// El componente cliente se encargará de toda la lógica de carga.
export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Ya no pasamos initialProduct, el cliente lo gestiona todo.
  return (
    <Suspense fallback={<ProductDetailPageSkeleton />}>
        <ProductClientPage slug={params.slug} />
    </Suspense>
  );
}
