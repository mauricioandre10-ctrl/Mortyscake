
export interface Course {
    slug: string;
    title: string;
    description: string;
    price: number;
    schedule: string;
    duration: string;
    image: {
        src: string;
        width: number;
        height: number;
        hint: string;
    };
    enrollmentUrl: string;
}

export const courses: Course[] = [
  {
    slug: 'mi-primera-tarta',
    title: 'Mi Primera Tarta',
    description: 'Aprende a hornear y decorar tu primera tarta desde cero. Ideal para principiantes.',
    price: 199,
    schedule: 'Sábados, 9am - 1pm',
    duration: '4 semanas',
    image: {
      src: 'https://picsum.photos/600/400',
      width: 600,
      height: 400,
      hint: 'first cake'
    },
    enrollmentUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTQ6mlI0dHtjcORvo0KokTP6R9Z1yhQmo0zHlkzHoLtQSBVg/viewform?usp=preview'
  },
  {
    slug: 'diseno-moderno-de-pasteles',
    title: 'Diseño Moderno de Pasteles',
    description: 'Explora técnicas contemporáneas de decoración de pasteles, desde glaseados de espejo hasta trabajos abstractos con chocolate.',
    price: 249,
    schedule: 'Domingos, 10am - 2pm',
    duration: '5 semanas',
    image: {
      src: 'https://picsum.photos/600/401',
      width: 600,
      height: 401,
      hint: 'modern cake'
    },
    enrollmentUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTQ6mlI0dHtjcORvo0KokTP6R9Z1yhQmo0zHlkzHoLtQSBVg/viewform?usp=preview'
  },
  {
    slug: 'la-ciencia-del-pan-de-masa-madre',
    title: 'La Ciencia del Pan de Masa Madre',
    description: 'Sumérgete en la ciencia de la levadura salvaje. Cultiva tu propio iniciador y hornea panes rústicos y sabrosos.',
    price: 179,
    schedule: 'Martes y Jueves, 6pm - 8pm',
    duration: '3 semanas',
    image: {
      src: 'https://picsum.photos/600/402',
      width: 600,
      height: 402,
      hint: 'sourdough bread'
    },
    enrollmentUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTQ6mlI0dHtjcORvo0KokTP6R9Z1yhQmo0zHlkzHoLtQSBVg/viewform?usp=preview'
  },
  {
    slug: 'macarons-y-merengue',
    title: 'Macarons y Merengue',
    description: 'Perfecciona el macaron, famoso por su dificultad, y explora la versatilidad del merengue en varios postres clásicos.',
    price: 159,
    schedule: 'Lunes, 5pm - 8pm',
    duration: '2 semanas',
    image: {
      src: 'https://picsum.photos/600/403',
      width: 600,
      height: 403,
      hint: 'macaron cookies'
    },
    enrollmentUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTQ6mlI0dHtjcORvo0KokTP6R9Z1yhQmo0zHlkzHoLtQSBVg/viewform?usp=preview'
  },
];
