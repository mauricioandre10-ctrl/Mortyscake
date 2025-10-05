'use server';

import { wooCommerce } from '@/lib/woocommerce';

export async function getFeaturedProducts() {
  try {
    // Primero, encontrar el ID de la categoría "cursos" para excluirla.
    const categoriesResponse = await wooCommerce.get('products/categories', { slug: 'cursos' });
    let courseCategoryId;
    if (categoriesResponse.status === 200 && categoriesResponse.data && categoriesResponse.data.length > 0) {
      courseCategoryId = categoriesResponse.data[0].id;
    }

    const response = await wooCommerce.get('products', {
      per_page: 9,
      orderby: 'date',
      order: 'desc',
      // Excluir la categoría de cursos si se encontró su ID.
      ...(courseCategoryId && { category: `not-in:${courseCategoryId}` })
    });

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
