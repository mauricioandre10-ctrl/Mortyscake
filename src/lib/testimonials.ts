
export interface Testimonial {
  name: string;
  course: string;
  quote: string;
  avatar: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Ana García',
    course: 'Mi Primera Tarta',
    quote: '¡El curso superó mis expectativas! Morty explica de una manera tan clara y paciente que me sentí segura desde el primer momento. ¡Jamás pensé que podría hacer una tarta tan bonita!',
    avatar: '/image/avatar-1.webp',
    rating: 5,
  },
  {
    name: 'Carlos Pérez',
    course: 'Diseño Gourmet de Pasteles',
    quote: 'Como aficionado, quería llevar mis habilidades al siguiente nivel y este curso fue exactamente lo que necesitaba. Las técnicas son modernas y el resultado es súper profesional.',
    avatar: '/image/avatar-2.webp',
    rating: 5,
  },
  {
    name: 'Sofía Rodríguez',
    course: 'Mi Primera Tarta',
    quote: 'Una experiencia increíble. El ambiente de la clase online es genial y muy participativo. Lo recomiendo al 100% para cualquiera que quiera empezar en este dulce mundo.',
    avatar: '/image/avatar-3.webp',
    rating: 5,
  },
];

    