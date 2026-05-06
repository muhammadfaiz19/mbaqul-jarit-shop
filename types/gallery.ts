import type { ProductCategory } from './product';

export interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  category?: ProductCategory | 'lifestyle' | 'behind-the-scenes';
  alt: string;
}
