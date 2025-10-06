
export interface Testimonial {
  name: string;
  course?: string;
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
  {
    name: 'Tamara',
    course: 'Tarta de Cumpleaños',
    quote: 'Una tarta preciosa y súper rica!! Muy profesional y súper atenta. Repetiremos sin duda. Gracias!!',
    avatar: 'https://picsum.photos/seed/avatar4/100/100',
    rating: 5,
  },
  {
    name: 'Ana',
    course: 'Dulces Variados',
    quote: 'Unas tartas y unos dulces realmente exquisitos, elaborados con mucho mimo y con productos de primera calidad, además de una presentación excelente. Profesionalidad y resultados de 10.',
    avatar: 'https://picsum.photos/seed/avatar5/100/100',
    rating: 5,
  },
  {
    name: 'Nerea',
    course: 'Tarta Infantil',
    quote: 'Le encargué una tarta para el cumple de mi hija y no pudo quedar más bonita. A todo el mundo le encantó. Estaba riquísima y el trato inmejorable. Muchas gracias por todo.',
    avatar: 'https://picsum.photos/seed/avatar6/100/100',
    rating: 5,
  },
  {
    name: 'Lorena',
    course: 'Tarta de Aniversario',
    quote: 'Increíble. La tarta era una obra de arte y de sabor... ¡indescriptible! Súper amable y atenta a cada detalle. Recomendable al 200%.',
    avatar: 'https://picsum.photos/seed/avatar7/100/100',
    rating: 5,
  },
  {
    name: 'David',
    course: 'Encargo para Evento',
    quote: 'Profesionalidad máxima. Se adaptó a lo que necesitábamos para un evento de empresa y el resultado superó las expectativas. Todos los asistentes quedaron impresionados.',
    avatar: 'https://picsum.photos/seed/avatar8/100/100',
    rating: 5,
  },
  {
    name: 'Laura',
    course: 'Tarta Vegana',
    quote: 'No es fácil encontrar opciones veganas tan ricas y bien elaboradas. La tarta de chocolate y frambuesa estaba de muerte. ¡Gracias por pensar en todos!',
    avatar: 'https://picsum.photos/seed/avatar9/100/100',
    rating: 5,
  }
];
