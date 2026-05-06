export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  description: string;
  fullDescription: string;
  material: string;
  sizes?: string[];
  images: string[];
  whatsappMessage: string;
  tiktokUrl: string;
  isFeatured: boolean;
}

export type ProductCategory = 'daster' | 'dress' | 'kemeja' | 'tunik';

export interface Category {
  slug: ProductCategory;
  name: string;
  description: string;
  icon: string;
  image: string;
}
