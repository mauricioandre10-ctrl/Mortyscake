
export interface Testimonial {
  name: string;
  course: string;
  quote: string;
  avatar: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    name: 'Raquel',
    course: 'Tarta de Bautizo',
    quote: 'Encargué una tarta para el bautizo de mi hijo y el resultado fue espectacular, ¡no sobraron ni las migas! La atención inmejorable y el trato súper cercano. Repetiré seguro.',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
    rating: 5,
  },
  {
    name: 'Rosa Maria',
    course: 'Tarta de Cumpleaños',
    quote: 'Una maravilla de tarta, estaba riquísima y era preciosa, con todos los detalles que le pedimos. El bizcocho súper jugoso. ¡Repetiremos seguro! Gracias por todo.',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
    rating: 5,
  },
  {
    name: 'Maria Jose',
    course: 'Tarta Personalizada',
    quote: 'Las tartas son impresionantes, tanto en sabor como en decoración. Se nota que le pone mucho mimo y cariño a todo lo que hace. Un trato de 10. Para repetir una y mil veces.',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
    rating: 5,
  },
];
