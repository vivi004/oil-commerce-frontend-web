import { ProductStatus } from '../enums';

export type WeightVariantCode =
  | '100ml'
  | '200ml'
  | '500ml'
  | '1L'
  | '2L'
  | '5L'
  | '5Kg'
  | '15L'
  | '15Kg';

export interface WeightVariant {
  code: WeightVariantCode;
  label: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  enabled: boolean; // Configurable on/off in admin for certain products
  sku: string;
}

export interface NutritionalFact {
  nutrient: string;
  amountPer100g: string;
  dailyValue?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  discount?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockThreshold?: number;
  images: ProductImage[];
  thumbnail: string;
  categoryId: string;
  category?: Category;
  tags?: string[];
  brand?: 'Nisha Pure Oils' | 'Varshini Gold' | 'Roshini Gold' | 'Rosi Gold' | string;
  attributes?: ProductAttribute[];
  variants?: ProductVariant[];
  weightVariants?: WeightVariant[];
  benefits?: string[];
  nutritionalInfo?: NutritionalFact[];
  extractionMethod?: string;
  smokePoint?: string;
  purity?: string;
  shelfLife?: string;
  origin?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isOnSale: boolean;
  isBestSeller?: boolean;
  status: ProductStatus;
  weight?: number;
  dimensions?: ProductDimensions;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: ProductAttribute[];
  image?: string;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: 'cm' | 'in';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  productCount?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  brand?: string[];
  tags?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popularity';
  page?: number;
  pageSize?: number;
}
