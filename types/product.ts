export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: number;
  description: string;
  fullDescription: string;
  material: string;
  sizes: string[];
  images: string[];
  whatsappMessage: string;
  tiktokUrl?: string;
  shopeeUrl?: string;
  isFeatured: boolean;
  category?: string | Category;
  createdAt?: string;
}

export type ProductCategory = 'daster' | 'dress' | 'kemeja' | 'tunik';

export interface Category {
  id: number;
  slug: string;
  name: string;
  description?: string;
  image?: string;
  createdAt?: string;
}
