import { Injectable, inject } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { Product, Category, ProductFilter, WeightVariant, WeightVariantCode, ProductImage } from '../models/product.model';
import { ProductStatus } from '../enums/product-status.enum';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { PaginatedResponse } from '../models/api-response.model';
import { environment } from '../../../environments/environment';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-groundnut',
    name: 'Groundnut Oil',
    slug: 'groundnut-oil',
    icon: '🥜',
    description: 'Traditional wood-churned (Marachekku) and filtered groundnut oils packed with heart-healthy MUFA.',
    productCount: 2,
    isActive: true,
    sortOrder: 1,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-coconut',
    name: 'Coconut Oil',
    slug: 'coconut-oil',
    icon: '🥥',
    description: 'Sun-dried copra virgin cold-pressed coconut oil for aromatic cooking, skin glow, and hair health.',
    productCount: 2,
    isActive: true,
    sortOrder: 2,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-sesame',
    name: 'Sesame Oil (Gingelly)',
    slug: 'sesame-oil',
    icon: '🌾',
    description: 'Cold-pressed gingelly oil churned with pure palm jaggery, rich in calcium and natural antioxidants.',
    productCount: 2,
    isActive: true,
    sortOrder: 3,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-castor',
    name: 'Castor Oil',
    slug: 'castor-oil',
    icon: '🌿',
    description: 'Pure cold-pressed castor oil (Vilakkennai) for natural laxative, eyebrow growth, and therapeutic massage.',
    productCount: 1,
    isActive: true,
    sortOrder: 4,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-lamp',
    name: 'Lamp Oil (Puja Oil)',
    slug: 'lamp-oil',
    icon: '🪔',
    description: 'Sacred Pancha Deepa blend infused with divine aroma for steady, soot-free pooja lamp lighting.',
    productCount: 2,
    isActive: true,
    sortOrder: 5,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-neem',
    name: 'Neem Oil',
    slug: 'neem-oil',
    icon: '🍃',
    description: '100% natural organic cold-pressed neem seed oil for plant protection, hair care, and skin remedies.',
    productCount: 1,
    isActive: true,
    sortOrder: 6,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-mahua',
    name: 'Mahua Oil (Iluppai)',
    slug: 'mahua-oil',
    icon: '🌼',
    description: 'Traditional Iluppai Ennai extracted from wild mahua seeds for sacred temple lamps and joint massage.',
    productCount: 1,
    isActive: true,
    sortOrder: 7,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-palm',
    name: 'Palm Oil',
    slug: 'palm-oil',
    icon: '🌴',
    description: 'Varshini Gold triple-refined culinary palm oil with high heat stability and zero cholesterol.',
    productCount: 1,
    isActive: true,
    sortOrder: 8,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-burfi',
    name: 'Burfi (Kadalai Mittai)',
    slug: 'burfi',
    icon: '🍬',
    description: 'Crunchy peanut burfi chikki prepared with fresh roasted peanuts and organic sugarcane jaggery.',
    productCount: 1,
    isActive: true,
    sortOrder: 9,
    createdAt: '2025-01-01',
  },
  {
    id: 'cat-oilcake',
    name: 'Oil Cake',
    slug: 'oil-cake',
    icon: '📦',
    description: 'High-protein groundnut and sesame oil cakes (Pinnakku) for organic dairy cattle feed and soil enrichment.',
    productCount: 1,
    isActive: true,
    sortOrder: 10,
    createdAt: '2025-01-01',
  },
];

const ALL_VARIANT_CODES: WeightVariantCode[] = [
  '100ml', '200ml', '500ml', '1L', '2L', '5L', '5Kg', '15L', '15Kg'
];

function generateVariants(
  basePrice1L: number,
  enabledCodes: WeightVariantCode[],
  isSolid: boolean = false
): WeightVariant[] {
  const multipliers: Record<WeightVariantCode, number> = {
    '100ml': 0.14,
    '200ml': 0.25,
    '500ml': 0.55,
    '1L': 1.00,
    '2L': 1.95,
    '5L': 4.70,
    '5Kg': 4.85,
    '15L': 13.6,
    '15Kg': 14.0,
  };

  return ALL_VARIANT_CODES.map((code) => {
    const isEnabled = enabledCodes.includes(code);
    const price = Math.round(basePrice1L * multipliers[code]);
    const compareAtPrice = Math.round(price * 1.15);

    let label: string = code;
    if (isSolid) {
      if (code === '500ml') label = '500g';
      if (code === '1L') label = '1Kg';
      if (code === '2L') label = '2Kg';
    }

    return {
      code,
      label,
      price,
      compareAtPrice,
      stock: isEnabled ? (code === '15L' || code === '15Kg' ? 18 : 65) : 0,
      enabled: isEnabled,
      sku: `SKU-${code.toUpperCase()}`,
    };
  });
}

export const MOCK_PRODUCTS: Product[] = [];

const SF_PRODUCTS_KEY = 'shopzone_products_v1';
const SF_CATEGORIES_KEY = 'shopzone_categories_v1';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  private getActiveProducts(): Product[] {
    const demoSkus = new Set(['NPO-GNO-001', 'NPO-VCO-002', 'NPO-SES-003', 'VG-LMP-004', 'VG-LMP-005', 'NPO-CAKE-005', 'NPO-CAS-004', 'NPO-CNO-002', 'NPO-NEM-006']);
    if (typeof window !== 'undefined') {
      try {
        // Cross-app sync: check if admin panel saved products
        const adminData = localStorage.getItem('nisha_admin_products_v1');
        if (adminData) {
          const adminProducts = JSON.parse(adminData);
          if (Array.isArray(adminProducts) && adminProducts.length > 0) {
            const valid = adminProducts.filter((p: any) => !p.id?.startsWith?.('prod-') && !demoSkus.has(p.sku));
            if (valid.length > 0) {
              return valid.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug || p.name.toLowerCase().replace(/\s+/g, '-'),
                description: p.description,
                shortDescription: p.shortDescription || p.description?.slice(0, 150),
                price: Number(p.minPrice || p.price || 100),
                compareAtPrice: Number(p.maxPrice || p.compareAtPrice || 120),
                discount: p.compareAtPrice && p.price && p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0,
                sku: p.sku,
                stock: Number(p.totalStock ?? p.stock ?? 0),
                thumbnail: this.resolveImageUrl(p.primaryImage || p.thumbnail),
                images: (p.images || []).map((img: string, idx: number) => ({ id: `img-${idx}`, url: this.resolveImageUrl(img), isPrimary: idx === 0, sortOrder: idx })),
                categoryId: p.categoryId,
                category: { id: p.categoryId, name: p.category, slug: (p.category || '').toLowerCase().replace(/\s+/g, '-'), icon: '🛢️', description: '', productCount: 0, isActive: true, sortOrder: 1, createdAt: '' },
                brand: p.brand,
                tags: ['cold pressed', 'unrefined'],
                rating: 5.0,
                reviewCount: 0,
                isFeatured: p.featured ?? true,
                isOnSale: p.onSale ?? false,
                isBestSeller: p.bestSeller ?? false,
                status: p.status,
                extractionMethod: p.extractionMethod || 'Traditional Cold Pressed',
                smokePoint: '210°C',
                purity: '100% Unrefined',
                shelfLife: '12 Months',
                origin: p.origin || 'Tamil Nadu',
                weightVariants: (p.variants || []).map((v: any) => ({
                  code: v.size,
                  label: `${v.size} Bottle`,
                  price: Number(v.sellingPrice),
                  compareAtPrice: Number(v.mrp),
                  discount: 0,
                  stock: Number(v.stockQuantity || 0),
                  enabled: v.isEnabled !== false,
                  sku: v.sku
                })),
                benefits: Array.isArray(p.benefits) ? p.benefits : (p.benefits ? p.benefits.split('.') : ['100% Pure', 'Unrefined']),
                nutritionalInfo: [],
                createdAt: p.createdAt || new Date().toISOString(),
                updatedAt: p.updatedAt || new Date().toISOString()
              }));
            }
          }
        }
        const sfData = localStorage.getItem(SF_PRODUCTS_KEY);
        if (sfData) {
          const parsed = JSON.parse(sfData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.filter((p: any) => !p.id?.startsWith?.('prod-') && !demoSkus.has(p.sku));
          }
        }
      } catch (e) {
        console.warn('Could not read stored products:', e);
      }

    }
    return MOCK_PRODUCTS;
  }

  private persistLocalProducts(products: Product[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SF_PRODUCTS_KEY, JSON.stringify(products));
      } catch (e) {
        console.warn('Could not save storefront products:', e);
      }
    }
  }

  private getActiveCategories(): Category[] {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(SF_CATEGORIES_KEY) || localStorage.getItem('nisha_admin_categories_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Convert to storefront category model if needed
            return parsed.map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
              icon: c.icon || '🌾',
              description: c.description || '',
              productCount: c.productCount || 0,
              isActive: c.isActive !== false,
              sortOrder: c.sortOrder || 1,
              createdAt: c.createdAt || '2025-01-01'
            }));
          }
        }
      } catch (e) {
        console.warn('Could not read stored categories:', e);
      }
    }
    return MOCK_CATEGORIES;
  }

  resolveImageUrl(url?: string): string {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const base = (environment.apiBaseUrl || '').replace(/\/api\/?$/, '');
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `${base}${cleanPath}`;
  }

  mapBackendProduct(p: any): Product {
    const rawImages = Array.isArray(p.images) ? p.images : [];
    const images: ProductImage[] = rawImages.map((img: any, idx: number) => {
      const url = typeof img === 'string' ? img : (img?.url || img?.imageUrl || '');
      return {
        id: (img && img.id) ? String(img.id) : `img-${idx}`,
        url: this.resolveImageUrl(url),
        isPrimary: idx === 0,
        sortOrder: idx
      };
    });

    const thumbnail = this.resolveImageUrl(p.thumbnail || (images[0]?.url ?? ''));

    const weightVariants: WeightVariant[] = Array.isArray(p.weightVariants)
      ? p.weightVariants.map((v: any) => ({
        code: (v.code || v.name || v.size || '1L') as WeightVariantCode,
        label: v.name || v.label || `${v.code || '1L'} Bottle`,
        // Backend DTO uses sellingPrice; fall back to price for legacy data
        price: Number(v.sellingPrice || v.price || 0),
        compareAtPrice: v.mrp ? Number(v.mrp) : (v.compareAtPrice ? Number(v.compareAtPrice) : undefined),
        stock: Number(v.stock ?? v.stockQuantity ?? 0),
        enabled: v.enabled !== false && v.isEnabled !== false,
        sku: v.sku || ''
      }))
      : [];

    return {
      id: String(p.id),
      name: p.name,
      slug: p.slug || (p.name ? p.name.toLowerCase().replace(/\s+/g, '-') : ''),
      description: p.description || '',
      shortDescription: p.shortDescription || p.description?.slice(0, 150) || '',
      price: Number(p.price || 0) || (weightVariants.filter(v => v.enabled && v.price > 0).map(v => v.price).sort((a, b) => a - b)[0] ?? 0),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : (weightVariants.filter(v => v.enabled && (v.compareAtPrice ?? 0) > 0).map(v => v.compareAtPrice as number).sort((a, b) => b - a)[0] ?? undefined),
      discount: p.discount || 0,
      sku: p.sku || '',
      barcode: p.barcode,
      stock: Number(p.stock ?? 0),
      lowStockThreshold: p.lowStockThreshold,
      thumbnail,
      images: images.length > 0 ? images : (thumbnail ? [{ id: 'img-thumb', url: thumbnail, isPrimary: true, sortOrder: 0 }] : []),
      categoryId: String(p.categoryId || ''),
      category: p.category || (p.categoryId ? {
        id: String(p.categoryId),
        name: p.categoryName || 'General',
        slug: p.categorySlug || 'general',
        icon: '🛢️',
        description: '',
        productCount: 0,
        isActive: true,
        sortOrder: 1,
        createdAt: ''
      } : undefined),
      brand: p.brand || p.brandName || 'Nisha Pure Oils',
      tags: p.tags || ['cold pressed', 'pure'],
      rating: Number(p.rating || 5.0),
      reviewCount: Number(p.reviewCount || 0),
      isFeatured: !!p.isFeatured,
      isOnSale: !!p.isOnSale,
      isBestSeller: !!p.isBestSeller,
      status: p.status || ProductStatus.ACTIVE,
      extractionMethod: p.extractionMethod || 'Traditional Cold Pressed',
      smokePoint: p.smokePoint || '210°C',
      purity: p.purity || '100% Unrefined',
      shelfLife: p.shelfLife || '12 Months',
      origin: p.origin || 'Tamil Nadu',
      weightVariants,
      benefits: Array.isArray(p.benefits) ? p.benefits : (p.benefits ? [p.benefits] : ['100% Pure', 'Unrefined']),
      nutritionalInfo: p.nutritionalInfo || [],
      createdAt: p.createdAt ? String(p.createdAt) : new Date().toISOString(),
      updatedAt: p.updatedAt ? String(p.updatedAt) : new Date().toISOString()
    };
  }

  getProducts(filter?: ProductFilter): Observable<PaginatedResponse<Product>> {
    return this.api
      .get<PaginatedResponse<any>>(API_ENDPOINTS.PRODUCTS.LIST, filter as Record<string, unknown>)
      .pipe(
        map((res) => {
          if (res?.data?.items && res.data.items.length > 0) {
            return {
              ...res.data,
              items: res.data.items.map((item: any) => this.mapBackendProduct(item))
            };
          }
          return this.filterMockProducts(filter);
        }),
        catchError(() => of(this.filterMockProducts(filter))),
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.api
      .get<any>(API_ENDPOINTS.PRODUCTS.DETAIL(id))
      .pipe(
        map((res) => {
          if (res?.data) return this.mapBackendProduct(res.data);
          const prods = this.getActiveProducts();
          const found = prods.find((p) => p.id === id || p.slug === id);
          if (found) return found;
          throw new Error(`Product with ID "${id}" not found`);
        }),
        catchError(() => {
          const prods = this.getActiveProducts();
          const found = prods.find((p) => p.id === id || p.slug === id);
          if (found) return of(found);
          throw new Error(`Product with ID "${id}" not found`);
        }),
      );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.api.get<any[]>(API_ENDPOINTS.PRODUCTS.FEATURED).pipe(
      map((res) => {
        if (res?.data && res.data.length > 0) {
          return res.data.map((item: any) => this.mapBackendProduct(item));
        }
        return this.getActiveProducts().filter((p) => p.isFeatured);
      }),
      catchError(() => of(this.getActiveProducts().filter((p) => p.isFeatured)))
    );
  }

  getBestSellers(): Observable<Product[]> {
    return of(this.getActiveProducts().filter((p) => p.isBestSeller));
  }

  getOnSaleProducts(): Observable<Product[]> {
    return of(this.getActiveProducts().filter((p) => p.isOnSale));
  }

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>(API_ENDPOINTS.CATEGORIES.LIST).pipe(
      map((res) => (res.data && res.data.length > 0 ? res.data : this.getActiveCategories())),
      catchError(() => of(this.getActiveCategories())),
    );
  }

  getProductsByBrand(brandName: string): Observable<Product[]> {
    return of(
      this.getActiveProducts().filter(
        (p) => p.brand?.toLowerCase() === brandName.toLowerCase(),
      ),
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    if (!query) return of([]);
    const q = query.toLowerCase();
    return of(
      this.getActiveProducts().filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.name.toLowerCase().includes(q),
      ),
    );
  }

  // ── Admin Variant Availability Control ────────────────────────────────────
  /**
   * Toggles whether a specific weight variant is available (on/off)
   * or updates its stock quantity in real-time and persists locally.
   */
  toggleProductVariant(
    productId: string,
    variantCode: WeightVariantCode,
    enabled: boolean,
  ): Observable<Product> {
    const products = this.getActiveProducts();
    const product = products.find((p) => p.id === productId);
    if (!product || !product.weightVariants) {
      return of(product as Product);
    }

    const variant = product.weightVariants.find((v) => v.code === variantCode);
    if (variant) {
      variant.enabled = enabled;
      if (!enabled) {
        variant.stock = 0;
      } else if (variant.stock === 0) {
        variant.stock = 50;
      }
    }
    this.persistLocalProducts(products);
    return of({ ...product });
  }

  updateProductVariantStock(
    productId: string,
    variantCode: WeightVariantCode,
    stock: number,
  ): Observable<Product> {
    const products = this.getActiveProducts();
    const product = products.find((p) => p.id === productId);
    if (product?.weightVariants) {
      const variant = product.weightVariants.find((v) => v.code === variantCode);
      if (variant) {
        variant.stock = stock;
        variant.enabled = stock > 0;
      }
      this.persistLocalProducts(products);
    }
    return of({ ...product as Product });
  }

  private filterMockProducts(filter?: ProductFilter): PaginatedResponse<Product> {
    let items = [...this.getActiveProducts()];

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q),
      );
    }
    if (filter?.categoryId) {
      items = items.filter((p) => p.categoryId === filter.categoryId || p.category?.slug === filter.categoryId);
    }
    if (filter?.brand && filter.brand.length > 0) {
      items = items.filter((p) => p.brand && filter.brand!.includes(p.brand));
    }
    if (filter?.minPrice !== undefined && filter.minPrice !== null) {
      items = items.filter((p) => p.price >= filter.minPrice!);
    }
    if (filter?.maxPrice !== undefined && filter.maxPrice !== null) {
      items = items.filter((p) => p.price <= filter.maxPrice!);
    }
    if (filter?.minRating) {
      items = items.filter((p) => p.rating >= filter.minRating!);
    }
    if (filter?.onSale) {
      items = items.filter((p) => p.isOnSale);
    }
    if (filter?.inStock) {
      items = items.filter((p) => p.stock > 0);
    }

    // Sorting
    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'price_asc':
          items.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          items.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          items.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          items.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case 'popularity':
        default:
          items.sort((a, b) => b.reviewCount - a.reviewCount);
      }
    }

    const page = filter?.page ?? 1;
    const pageSize = filter?.pageSize ?? 12;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      total: totalItems,
      totalItems,
      page,
      pageSize,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }
}
