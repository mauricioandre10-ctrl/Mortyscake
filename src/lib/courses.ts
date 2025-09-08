
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
    price: 60,
    schedule: '25 de septiembre 2 pm',
    duration: '4 horas',
    image: {
      src: '/image/mi_primera_tarta.webp',
      width: 600,
      height: 400,
      hint: 'first cake'
    },
    enrollmentUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTQ6mlI0dHtjcORvo0KokTP6R9Z1yhQmo0zHlkzHoLtQSBVg/viewform?usp=preview'
  },
  {
    slug: 'diseno-gourmet-de-pasteles',
    title: 'Diseño Gourmet de Pasteles',
    description: 'Explora técnicas contemporáneas de decoración de pasteles, desde glaseados de espejo hasta trabajos abstractos con chocolate.',
    price: 150,
    schedule: '30 de septiembre 2 pm',
    duration: '4 horas',
    image: {
      src: '/image/Diseño_Gourmet_de_pasteles.webp',
      width: 600,
      height: 401,
      hint: 'modern cake'
    },
    enrollmentUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSeTQ6mlI0dHtjcORvo0KokTP6R9Z1yhQmo0zHlkzHoLtQSBVg/viewform?usp=preview'
  }
];
