
export interface Product {
    slug: string;
    name: string;
    description: string;
    price: number;
    image: {
        src: string;
        width: number;
        height: number;
        hint: string;
    };
}

export const products: Product[] = [
  {
    slug: 'colorante-gel-rojo-pasion',
    name: 'Colorante en Gel "Rojo Pasión"',
    description: 'Colorante ultra concentrado para masas, cremas y glaseados. Aporta un color rojo intenso y duradero sin alterar la consistencia.',
    price: 4.95,
    image: {
      src: 'https://picsum.photos/seed/product1/500/500',
      width: 500,
      height: 500,
      hint: 'food coloring'
    },
  },
  {
    slug: 'espatula-acero-inoxidable',
    name: 'Espátula Angular de Acero Inoxidable',
    description: 'Perfecta para alisar coberturas y glaseados con precisión profesional. Mango ergonómico para un agarre cómodo.',
    price: 12.50,
    image: {
      src: 'https://picsum.photos/seed/product2/500/500',
      width: 500,
      height: 500,
      hint: 'palette knife'
    },
  },
  {
    slug: 'set-boquillas-rusas',
    name: 'Set de Boquillas Rusas para Flores',
    description: 'Crea flores de buttercream espectaculares con un solo gesto. Incluye 7 diseños de boquillas de gran tamaño.',
    price: 18.90,
    image: {
      src: 'https://picsum.photos/seed/product3/500/500',
      width: 500,
      height: 500,
      hint: 'piping tips'
    },
  },
  {
    slug: 'vainilla-bourbon-pasta',
    name: 'Pasta de Vainilla Bourbon de Madagascar',
    description: 'Intenso sabor a vainilla con semillas naturales. Ideal para aromatizar bizcochos, cremas y helados.',
    price: 9.75,
    image: {
      src: 'https://picsum.photos/seed/product4/500/500',
      width: 500,
      height: 500,
      hint: 'vanilla paste'
    },
  },
    {
    slug: 'molde-desmontable-antiadherente',
    name: 'Molde Desmontable Antiadherente',
    description: 'Molde de 20cm con base extraíble y cierre rápido. Hornea bizcochos y tartas de queso perfectas.',
    price: 15.20,
    image: {
      src: 'https://picsum.photos/seed/product5/500/500',
      width: 500,
      height: 500,
      hint: 'cake pan'
    },
  },
  {
    slug: 'chocolate-belga-70-cacao',
    name: 'Chocolate Belga 70% Cacao',
    description: 'Perlas de chocolate negro de alta calidad, perfectas para fundir, ganaches y mousses. Sabor intenso y equilibrado.',
    price: 8.50,
    image: {
      src: 'https://picsum.photos/seed/product6/500/500',
      width: 500,
      height: 500,
      hint: 'chocolate chips'
    },
  },
  {
    slug: 'base-giratoria-tarta',
    name: 'Base Giratoria para Tartas',
    description: 'Plataforma estable y con giro suave para decorar tartas y pasteles con comodidad y precisión. Indispensable.',
    price: 22.00,
    image: {
      src: 'https://picsum.photos/seed/product7/500/500',
      width: 500,
      height: 500,
      hint: 'cake stand'
    },
  },
  {
    slug: 'sprinkles-mix-dorado',
    name: 'Sprinkles Mix "Fiesta Dorada"',
    description: 'Una mezcla elegante de perlas, fideos y formas en tonos dorados y blancos para un acabado de lujo.',
    price: 6.25,
    image: {
      src: 'https://picsum.photos/seed/product8/500/500',
      width: 500,
      height: 500,
      hint: 'gold sprinkles'
    },
  },
    {
    slug: 'tapete-silicona-horneado',
    name: 'Tapete de Silicona para Horneado',
    description: 'Superficie antiadherente reutilizable para hornear galletas, macarons y mucho más. Medidas y guías circulares impresas.',
    price: 11.90,
    image: {
      src: 'https://picsum.photos/seed/product9/500/500',
      width: 500,
      height: 500,
      hint: 'silicone mat'
    },
  }
];

    