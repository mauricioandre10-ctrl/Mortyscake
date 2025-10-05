'use server';

import { wooCommerce } from '@/lib/woocommerce';

export async function getFeaturedProducts() {
  try {
    // Se cambia featured:true por una consulta más general para obtener los últimos 9 productos.
    const response = await wooCommerce.get('products', {
      per_page: 9,
      orderby: 'date',
      order: 'desc'
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
