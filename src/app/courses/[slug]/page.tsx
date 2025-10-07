
import { Suspense } from 'react';
import CourseClientPage from './CourseClientPage';
import CourseDetailPageSkeleton from './CourseDetailPageSkeleton';

type Props = {
  params: { slug: string };
};

// La obtención de datos del lado del servidor ha sido eliminada.
// El componente cliente se encargará de toda la lógica de carga.
export default function CourseDetailPage({ params }: Props) {
  // Siempre pasamos `null` para `initialCourse`.
  // El componente cliente (`CourseClientPage`) está diseñado para
  // obtener los datos en el navegador si `initialCourse` es `null`.
  return (
    <Suspense fallback={<CourseDetailPageSkeleton />}>
        <CourseClientPage initialCourse={null} slug={params.slug} />
    </Suspense>
  );
}
