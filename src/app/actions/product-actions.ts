'use server';

import { wooCommerce } from '@/lib/woocommerce';

export async function getFeaturedProducts() {
  try {
    const response = await wooCommerce.get('products', {
      featured: true,
      per_page: 3,
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
