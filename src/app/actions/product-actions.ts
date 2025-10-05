
'use server';

import { wooCommerce } from '@/lib/woocommerce';

export async function getFeaturedProducts() {
  try {
    const categoriesResponse = await wooCommerce.get('products/categories', { slug: 'cursos' });
    const courseCategory = categoriesResponse.data.find((cat: any) => cat.slug === 'cursos');

    const params: any = {
        per_page: 9,
        orderby: 'date',
        order: 'desc',
    };

    if (courseCategory) {
        // Obtenemos los IDs de los productos que SÍ son cursos
        const courseProductsResponse = await wooCommerce.get('products', {
            category: String(courseCategory.id),
            per_page: 100, // Asumimos que no habrá más de 100 cursos
            fields: 'id',
        });
        const courseProductIds = courseProductsResponse.data.map((p: any) => p.id);
        
        // Excluimos esos IDs de la consulta principal
        if (courseProductIds.length > 0) {
            params.exclude = courseProductIds;
        }
    }

    const response = await wooCommerce.get('products', params);

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error fetching products:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error);
    return [];
  }
}

export async function getCourseProducts() {
  try {
    const categoriesResponse = await wooCommerce.get('products/categories', { slug: 'cursos' });
    if (categoriesResponse.status !== 200 || !categoriesResponse.data || categoriesResponse.data.length === 0) {
        console.error('Course category not found.');
        return [];
    }
    const courseCategory = categoriesResponse.data[0];

    const response = await wooCommerce.get('products', {
      category: String(courseCategory.id),
      per_page: 9,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error fetching course products:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Error fetching course products from WooCommerce:', error);
    return [];
  }
}
