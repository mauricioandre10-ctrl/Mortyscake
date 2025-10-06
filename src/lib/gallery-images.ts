
export interface GalleryImage {
  src: string;
  alt: string;
  hint: string;
  width: number;
  height: number;
}

const hints = [
  'chocolate cake', 'pastry class', 'colorful cupcakes', 'cake decoration', 
  'macarons assortment', 'chef dusting dessert', 'wedding cake', 'fruit tart',
  'baking process', 'birthday cake'
];

// Generate 100 images for the gallery
export const galleryImages: GalleryImage[] = Array.from({ length: 100 }, (_, i) => {
  const seed = `gallery${i + 1}`;
  // Generate pseudo-random dimensions for a masonry layout effect
  const ratio = 0.6 + Math.random() * 0.4; // between 0.6 and 1.0
  const width = 800;
  const height = Math.floor(width * ratio);
  
  return {
    src: `https://picsum.photos/seed/${seed}/${width}/${height}`,
    alt: `Creación de repostería ${i + 1}`,
    hint: hints[i % hints.length],
    width,
    height,
  };
});
