
import { event } from './gtag';

// Acción: El usuario hace clic en el botón "Ver Detalles" de un producto o curso.
export const trackViewDetails = (itemName: string, itemCategory: 'Curso' | 'Producto') => {
  event({
    action: `Ver Detalles de ${itemCategory}`,
    category: 'Navegación',
    label: itemName,
    value: 1,
  });
};

// Acción: El usuario intenta añadir un producto o curso al carrito.
export const trackAddToCart = (itemName: string, itemCategory: 'Curso' | 'Producto', price: string) => {
  event({
    action: `Añadir ${itemCategory} al Carrito`,
    category: 'Compra',
    label: itemName,
    value: parseFloat(price) || 0,
  });
};

// Acción: El usuario hace clic en el botón de compartir.
export const trackShare = (itemName: string, method: string = 'Botón nativo') => {
  event({
    action: 'Compartir Contenido',
    category: 'Interacción',
    label: `Item: ${itemName} - Método: ${method}`,
    value: 1,
  });
};

// Acción: El usuario hace clic en un enlace a una red social.
export const trackSocialLink = (platform: 'Facebook' | 'Instagram' | 'WhatsApp') => {
    event({
        action: `Clic en Enlace Social`,
        category: 'Interacción',
        label: platform,
        value: 1,
    });
};
