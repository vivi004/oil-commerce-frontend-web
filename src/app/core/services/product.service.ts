import { Injectable, inject } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ApiService } from './api.service';
import { Product, Category, ProductFilter, WeightVariant, WeightVariantCode } from '../models/product.model';
import { ProductStatus } from '../enums/product-status.enum';
import { API_ENDPOINTS } from '../constants/api-endpoints.constants';
import { PaginatedResponse } from '../models/api-response.model';

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
    '1L':    1.00,
    '2L':    1.95,
    '5L':    4.70,
    '5Kg':   4.85,
    '15L':   13.6,
    '15Kg':  14.0,
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

export const MOCK_PRODUCTS: Product[] = [
  // 1. Groundnut Oil — Nisha Pure Oils
  {
    id: 'prod-groundnut-nisha',
    name: 'Nisha Pure Wood Cold Pressed Groundnut Oil (Marachekku Kadalai Ennai)',
    slug: 'nisha-wood-cold-pressed-groundnut-oil',
    description:
      'Extracted using slow wooden pestles (Vaagai Marachekku) below 40°C from hand-selected groundnuts of Saurashtra & Tamil Nadu. Rich, unrefined aroma, naturally nutty flavor, and loaded with heart-healthy monounsaturated fats and natural Vitamin E.',
    shortDescription: 'Traditional Marachekku cold-pressed peanut oil with zero chemicals and high smoke point.',
    price: 290,
    compareAtPrice: 340,
    discount: 15,
    sku: 'NPO-GNO-001',
    stock: 120,
    thumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-gno-1', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-gno-2', url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
      { id: 'img-gno-3', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 2 },
    ],
    categoryId: 'cat-groundnut',
    category: MOCK_CATEGORIES[0],
    brand: 'Nisha Pure Oils',
    tags: ['cold pressed', 'marachekku', 'groundnut oil', 'wood pressed', 'cooking oil'],
    rating: 4.9,
    reviewCount: 428,
    isFeatured: true,
    isOnSale: true,
    isBestSeller: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Vaagai Wooden Churner (Marachekku)',
    smokePoint: '225°C (Ideal for Deep Frying & Sautéing)',
    purity: '100% Raw Virgin Cold Pressed — Zero Solvents',
    shelfLife: '9 Months from Packing',
    origin: 'Kangeyam, Tamil Nadu',
    weightVariants: generateVariants(290, ['500ml', '1L', '2L', '5L', '15L']),
    benefits: [
      'Heart friendly with high monounsaturated fatty acids (MUFA)',
      'Natural source of Vitamin E & Resveratrol antioxidants',
      'High smoke point prevents breakdown and toxic fumes during frying',
      'Naturally aromatic without artificial coloring or argemone oil',
      'Supports optimal HDL cholesterol levels',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '900 kcal', dailyValue: '45%' },
      { nutrient: 'Total Fat', amountPer100g: '100 g', dailyValue: '128%' },
      { nutrient: 'Monounsaturated Fat (MUFA)', amountPer100g: '48.5 g', dailyValue: '—' },
      { nutrient: 'Polyunsaturated Fat (PUFA)', amountPer100g: '32.1 g', dailyValue: '—' },
      { nutrient: 'Saturated Fat', amountPer100g: '16.4 g', dailyValue: '82%' },
      { nutrient: 'Natural Vitamin E', amountPer100g: '15.7 mg', dailyValue: '105%' },
      { nutrient: 'Cholesterol', amountPer100g: '0 mg', dailyValue: '0%' },
      { nutrient: 'Trans Fatty Acids', amountPer100g: '0 g', dailyValue: '0%' },
    ],
    createdAt: '2025-01-05T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
  },

  // 2. Coconut Oil — Nisha Pure Oils
  {
    id: 'prod-coconut-nisha',
    name: 'Nisha Pure Cold Pressed Virgin Coconut Oil (Thengai Ennai)',
    slug: 'nisha-cold-pressed-virgin-coconut-oil',
    description:
      'Pressed exclusively from sulfur-free sun-dried Pollachi coconuts. Water-clear, delightfully sweet coconut scent, rich in Lauric Acid and MCTs. Ideal for South Indian delicacies, salad dressing, baby massage, and lustrous hair care.',
    shortDescription: '100% edible virgin coconut oil from fresh Pollachi coconuts. Multi-purpose cooking & hair care.',
    price: 420,
    compareAtPrice: 480,
    discount: 12,
    sku: 'NPO-CNO-002',
    stock: 95,
    thumbnail: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-cno-1', url: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-cno-2', url: 'https://images.unsplash.com/photo-1608248597359-005cb2e1e355?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
    ],
    categoryId: 'cat-coconut',
    category: MOCK_CATEGORIES[1],
    brand: 'Nisha Pure Oils',
    tags: ['coconut oil', 'virgin coconut', 'marachekku', 'hair care', 'keto oil'],
    rating: 4.95,
    reviewCount: 512,
    isFeatured: true,
    isOnSale: false,
    isBestSeller: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Wooden Rotary Churner from Sulfur-Free Copra',
    smokePoint: '177°C (Ideal for Traditional Tempering & Baking)',
    purity: '100% Raw Virgin — Unbleached & Non-Hydrogenated',
    shelfLife: '12 Months',
    origin: 'Pollachi, Tamil Nadu',
    weightVariants: generateVariants(420, ['100ml', '200ml', '500ml', '1L', '2L', '5L', '15L']),
    benefits: [
      '50%+ Lauric Acid boosts cellular immunity and gut health',
      'Medium Chain Triglycerides (MCTs) for instant sustained energy',
      'Nourishes hair roots, prevents dandruff, and strengthens follicles',
      'Gentle moisturizing baby massage oil with antimicrobial properties',
      'Authentic aroma for Aviyal, Thoran, and traditional tempering',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '898 kcal', dailyValue: '45%' },
      { nutrient: 'Total Fat', amountPer100g: '99.8 g', dailyValue: '128%' },
      { nutrient: 'Lauric Acid', amountPer100g: '51.2 g', dailyValue: '—' },
      { nutrient: 'MCT Content', amountPer100g: '64.5 g', dailyValue: '—' },
      { nutrient: 'Saturated Fat', amountPer100g: '86.5 g', dailyValue: '144%' },
      { nutrient: 'Cholesterol', amountPer100g: '0 mg', dailyValue: '0%' },
    ],
    createdAt: '2025-01-08T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },

  // 3. Sesame Oil — Nisha Pure Oils
  {
    id: 'prod-sesame-nisha',
    name: 'Nisha Pure Wood Pressed Sesame Oil (Gingelly / Nalla Ennai)',
    slug: 'nisha-wood-pressed-sesame-gingelly-oil',
    description:
      'Traditional Chekku Nalla Ennai made by crushing indigenous black sesame seeds with organic palm jaggery (Karupatti). Contains natural Sesamol and Sesamolin antioxidants. Deep earthy aroma, cooling therapeutic properties, and an authentic taste essential for Sambar, Kara Kuzhambu, and Idli Podi.',
    shortDescription: 'Chekku Gingelly oil churned with organic palm jaggery. Rich in calcium and sesamol.',
    price: 480,
    compareAtPrice: 530,
    discount: 9,
    sku: 'NPO-SES-003',
    stock: 80,
    thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-ses-1', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-ses-2', url: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
    ],
    categoryId: 'cat-sesame',
    category: MOCK_CATEGORIES[2],
    brand: 'Nisha Pure Oils',
    tags: ['sesame oil', 'gingelly oil', 'nalla ennai', 'oil pulling', 'palm jaggery'],
    rating: 4.88,
    reviewCount: 310,
    isFeatured: true,
    isOnSale: true,
    isBestSeller: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Wooden Rotary with Palm Jaggery (Karupatti)',
    smokePoint: '210°C',
    purity: '100% Pure First Pressing — Unrefined',
    shelfLife: '12 Months',
    origin: 'Tiruppur, Tamil Nadu',
    weightVariants: generateVariants(480, ['200ml', '500ml', '1L', '2L', '5L', '15L']),
    benefits: [
      'High natural calcium & magnesium strengthens bone density',
      'Sesamol and sesamin protect cells against oxidative damage',
      'Excellent for daily morning Oil Pulling (Gandusha) for dental hygiene',
      'Traditional weekly oil bath (Ennai Kuliyal) cools body heat',
      'Irreplaceable aromatic pairing with gunpowder (Idli Podi)',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '899 kcal', dailyValue: '45%' },
      { nutrient: 'Total Fat', amountPer100g: '99.9 g', dailyValue: '128%' },
      { nutrient: 'MUFA', amountPer100g: '41.2 g', dailyValue: '—' },
      { nutrient: 'PUFA', amountPer100g: '43.5 g', dailyValue: '—' },
      { nutrient: 'Calcium', amountPer100g: '60 mg', dailyValue: '6%' },
      { nutrient: 'Iron', amountPer100g: '1.8 mg', dailyValue: '10%' },
    ],
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-02-20T00:00:00Z',
  },

  // 4. Castor Oil — Nisha Pure Oils
  {
    id: 'prod-castor-nisha',
    name: 'Nisha Pure Cold Pressed Castor Oil (Pure Vilakkennai)',
    slug: 'nisha-cold-pressed-castor-oil',
    description:
      'Pure, thick cold-pressed oil drawn from sun-dried Ricinus communis seeds. Hexane-free and unrefined. Widely revered in Ayurveda & Siddha for hair regrowth, cooling body temperature, eyebrow thickening, and joint stiffness relief.',
    shortDescription: 'Hexane-free pure cold-pressed castor oil for hair regrowth, thick eyebrows, and body cooling.',
    price: 490,
    compareAtPrice: 550,
    discount: 11,
    sku: 'NPO-CAS-004',
    stock: 65,
    thumbnail: 'https://images.unsplash.com/photo-1608248597359-005cb2e1e355?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-cas-1', url: 'https://images.unsplash.com/photo-1608248597359-005cb2e1e355?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-cas-2', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
    ],
    categoryId: 'cat-castor',
    category: MOCK_CATEGORIES[3],
    brand: 'Nisha Pure Oils',
    tags: ['castor oil', 'vilakkennai', 'hair growth', 'eyebrows', 'skin healing'],
    rating: 4.82,
    reviewCount: 198,
    isFeatured: false,
    isOnSale: false,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Cold Hydraulic Press — No Heat or Chemicals',
    purity: '100% Pure Virgin Castor Oil — Grade A',
    shelfLife: '24 Months',
    origin: 'Erode, Tamil Nadu',
    weightVariants: generateVariants(490, ['100ml', '200ml', '500ml', '1L', '5L']),
    benefits: [
      'Rich in 90% Ricinoleic Acid that stimulates dormant hair follicles',
      'Natural thickener for fuller eyebrows and longer eyelashes',
      'Relieves stubborn dry skin, cracked heels, and eczema patches',
      'Traditional belly button application cools abdominal heat',
      'Soothes swollen arthritic joints when gently massaged warm',
    ],
    nutritionalInfo: [
      { nutrient: 'Ricinoleic Acid', amountPer100g: '89.4 g', dailyValue: '—' },
      { nutrient: 'Oleic Acid', amountPer100g: '3.8 g', dailyValue: '—' },
      { nutrient: 'Linoleic Acid', amountPer100g: '4.2 g', dailyValue: '—' },
      { nutrient: 'Vitamin E', amountPer100g: '12 mg', dailyValue: '80%' },
    ],
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-02-12T00:00:00Z',
  },

  // 5. Lamp Oil — Nisha Pure Oils
  {
    id: 'prod-lamp-nisha',
    name: 'Nisha Pure Pancha Deepa Lamp Oil (Puja Deepam Oil)',
    slug: 'nisha-pancha-deepa-lamp-oil',
    description:
      'Sacred Pancha Deepa blend formulated according to traditional Vastu & Agamic scriptures. Harmonious blend of 5 pure oils: Sesame, Castor, Mahua, Neem, and Pure Cow Ghee infused with Sugandha Dravyas. Emits a steady, radiant flame with divine temple fragrance and zero black smoke.',
    shortDescription: 'Sacred 5-oil blend with aromatic fragrance for divine, smoke-free temple & home pooja lamps.',
    price: 220,
    compareAtPrice: 260,
    discount: 15,
    sku: 'NPO-LMP-005',
    stock: 200,
    thumbnail: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-lmp-1', url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-lmp-2', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
    ],
    categoryId: 'cat-lamp',
    category: MOCK_CATEGORIES[4],
    brand: 'Nisha Pure Oils',
    tags: ['lamp oil', 'puja oil', 'deepam', 'divine aroma', 'pancha deepa'],
    rating: 4.93,
    reviewCount: 380,
    isFeatured: true,
    isOnSale: true,
    isBestSeller: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Scriptural Blend of 5 Cold-Pressed Sacred Oils',
    purity: 'Zero Mineral Oil — 100% Vegetable & Cow Ghee Base',
    shelfLife: '18 Months',
    origin: 'Erode, Tamil Nadu',
    weightVariants: generateVariants(220, ['500ml', '1L', '2L', '5L', '15L']),
    benefits: [
      'Brings peace, positive vibrations, and divine prosperity into the home',
      'Burns longer and brighter with uniform golden glow',
      'Zero black soot leaves brass and silver lamps clean and sparkling',
      'Subtle jasmine and temple sugandh clears stagnant indoor energy',
      'Free from hazardous paraffin or synthetic kerosene blends',
    ],
    nutritionalInfo: [
      { nutrient: 'Classification', amountPer100g: 'Spiritual Lamp Fuel', dailyValue: '—' },
      { nutrient: 'Sesame & Mahua Base', amountPer100g: '65%', dailyValue: '—' },
      { nutrient: 'Castor & Neem Fraction', amountPer100g: '25%', dailyValue: '—' },
      { nutrient: 'Pure Ghee & Sugandh', amountPer100g: '10%', dailyValue: '—' },
    ],
    createdAt: '2025-01-14T00:00:00Z',
    updatedAt: '2025-02-22T00:00:00Z',
  },

  // 6. Neem Oil — Nisha Pure Oils
  {
    id: 'prod-neem-nisha',
    name: 'Nisha Pure Organic Cold Pressed Neem Oil (Veppennai)',
    slug: 'nisha-organic-cold-pressed-neem-oil',
    description:
      '100% natural, unadulterated neem oil derived from ripe Azadirachta indica seeds. High Azadirachtin concentration (>1500 ppm). Highly effective for organic garden insect control, head lice treatment, pet coat care, and fungal skin conditions.',
    shortDescription: 'High-potency organic neem seed oil for pest control, dandruff relief, and organic farming.',
    price: 650,
    compareAtPrice: 720,
    discount: 10,
    sku: 'NPO-NEM-006',
    stock: 55,
    thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-nem-1', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'cat-neem',
    category: MOCK_CATEGORIES[5],
    brand: 'Nisha Pure Oils',
    tags: ['neem oil', 'organic pesticide', 'skin care', 'veppennai', 'anti-fungal'],
    rating: 4.75,
    reviewCount: 142,
    isFeatured: false,
    isOnSale: false,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Mechanical Cold Pressing — Raw & Unfiltered',
    purity: 'Azadirachtin content > 1500 PPM — 100% Pure',
    shelfLife: '24 Months',
    origin: 'Dharapuram, Tamil Nadu',
    weightVariants: generateVariants(650, ['100ml', '200ml', '500ml', '1L', '5L']),
    benefits: [
      'Eco-friendly organic pesticide protecting crops, flowers, and vegetables',
      'Powerful natural fungicide against powdery mildew and black spot',
      'Clears stubborn scalp dandruff and eliminates head lice naturally',
      'Soothes pet flea bites, ticks, and mange without toxic chemicals',
      'Potent antimicrobial properties for acne spot treatment',
    ],
    nutritionalInfo: [
      { nutrient: 'Azadirachtin Active', amountPer100g: '> 1800 PPM', dailyValue: '—' },
      { nutrient: 'Fatty Acids (Oleic/Palmitic)', amountPer100g: '98.5 g', dailyValue: '—' },
      { nutrient: 'Bitter Triterpenoids (Nimbidin)', amountPer100g: 'Present', dailyValue: '—' },
    ],
    createdAt: '2025-01-16T00:00:00Z',
    updatedAt: '2025-02-14T00:00:00Z',
  },

  // 7. Mahua Oil — Nisha Pure Oils
  {
    id: 'prod-mahua-nisha',
    name: 'Nisha Pure Traditional Mahua Oil (Iluppai Ennai)',
    slug: 'nisha-traditional-mahua-iluppai-oil',
    description:
      'Extracted from wild-harvested Madhuca longifolia tree seeds. Traditionally considered auspicious for lighting temple lamps during Pradosham and Rahu Kala poojas. In Siddha medicine, gently warmed Mahua oil is applied to relieve chronic rheumatism, nerve pain, and sprains.',
    shortDescription: 'Sacred Iluppai oil for Pradosham pooja lamps, soothing joint relief, and skin health.',
    price: 590,
    compareAtPrice: 650,
    discount: 9,
    sku: 'NPO-MAH-007',
    stock: 45,
    thumbnail: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-mah-1', url: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'cat-mahua',
    category: MOCK_CATEGORIES[6],
    brand: 'Nisha Pure Oils',
    tags: ['mahua oil', 'iluppai ennai', 'temple pooja', 'joint pain', 'siddha'],
    rating: 4.86,
    reviewCount: 88,
    isFeatured: false,
    isOnSale: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Cold Hydraulic Expeller',
    purity: '100% Wild Harvested Natural Oil',
    shelfLife: '18 Months',
    origin: 'Western Ghats, Tamil Nadu',
    weightVariants: generateVariants(590, ['200ml', '500ml', '1L', '5L']),
    benefits: [
      'Prescribed in ancient texts for lighting lamps to remove Rahu-Ketu doshas',
      'Provides quick relief for joint stiffness, arthritis, and muscular pain',
      'Emollient properties soothe chronic dry and itchy dermatological issues',
      'Natural wild botanical oil with gentle soothing warming sensations',
    ],
    nutritionalInfo: [
      { nutrient: 'Oleic Acid', amountPer100g: '46.3 g', dailyValue: '—' },
      { nutrient: 'Stearic Acid', amountPer100g: '19.8 g', dailyValue: '—' },
      { nutrient: 'Palmitic Acid', amountPer100g: '23.4 g', dailyValue: '—' },
    ],
    createdAt: '2025-01-18T00:00:00Z',
    updatedAt: '2025-02-19T00:00:00Z',
  },

  // 8. Palm Oil — Varshini Gold
  {
    id: 'prod-palm-varshini',
    name: 'Varshini Gold Triple Refined Palm Oil',
    slug: 'varshini-gold-refined-palm-oil',
    description:
      'Ultra-pure, deodorized, and triple-filtered cooking palm oil under the premium Varshini Gold label. Exceptional thermal resistance with very low oil absorption. Imparts crisp texture to snacks, pakoras, mixtures, and commercial culinary delicacies without greasy residue.',
    shortDescription: 'Light, non-sticky refined cooking oil with high smoke point for crispy, golden snacks.',
    price: 135,
    compareAtPrice: 155,
    discount: 13,
    sku: 'VG-PLM-008',
    stock: 250,
    thumbnail: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-plm-1', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-plm-2', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
    ],
    categoryId: 'cat-palm',
    category: MOCK_CATEGORIES[7],
    brand: 'Varshini Gold',
    tags: ['palm oil', 'varshini gold', 'deep frying', 'refined oil', 'crispy snacks'],
    rating: 4.7,
    reviewCount: 215,
    isFeatured: true,
    isOnSale: true,
    isBestSeller: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Multi-Stage Continuous Refining & Deodorization',
    smokePoint: '235°C (Superior High-Heat Frying)',
    purity: '100% Vegetable Palm Olein — Trans Fat Free',
    shelfLife: '9 Months',
    origin: 'Erode Processing Terminal',
    weightVariants: generateVariants(135, ['1L', '5L', '15L', '15Kg']),
    benefits: [
      'High thermal stability allows multiple frying cycles without foaming',
      'Absorbs significantly less oil in deep-fried snacks for lighter eating',
      'Neutral flavor retains natural aroma of your spices and ingredients',
      '100% cholesterol-free and enriched with Vitamin A & D fortification',
      'Economic bulk packaging ideal for families, bakeries, and restaurants',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '900 kcal', dailyValue: '45%' },
      { nutrient: 'Total Fat', amountPer100g: '100 g', dailyValue: '128%' },
      { nutrient: 'Monounsaturated Fat', amountPer100g: '44 g', dailyValue: '—' },
      { nutrient: 'Polyunsaturated Fat', amountPer100g: '11 g', dailyValue: '—' },
      { nutrient: 'Saturated Fat', amountPer100g: '45 g', dailyValue: '225%' },
      { nutrient: 'Vitamin A', amountPer100g: '750 mcg', dailyValue: '83%' },
      { nutrient: 'Vitamin D', amountPer100g: '11 mcg', dailyValue: '73%' },
      { nutrient: 'Trans Fat', amountPer100g: '0 g', dailyValue: '0%' },
    ],
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },

  // 9. Burfi — Nisha Pure Oils
  {
    id: 'prod-burfi-nisha',
    name: 'Nisha Pure Traditional Peanut Burfi (Kadalai Mittai)',
    slug: 'nisha-traditional-peanut-burfi-kadalai-mittai',
    description:
      'Handcrafted traditional candy made with slow-roasted indigenous peanuts and natural organic jaggery syrup. No refined white sugar, no glucose syrup, no preservatives. Crunchy, melt-in-mouth sweetness packed with protein, iron, and nostalgic taste of Kovilpatti.',
    shortDescription: 'Crunchy traditional groundnut chikki made with roasted peanuts and pure organic jaggery.',
    price: 260,
    compareAtPrice: 300,
    discount: 13,
    sku: 'NPO-BRF-009',
    stock: 140,
    thumbnail: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-brf-1', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
      { id: 'img-brf-2', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=80', isPrimary: false, sortOrder: 1 },
    ],
    categoryId: 'cat-burfi',
    category: MOCK_CATEGORIES[8],
    brand: 'Nisha Pure Oils',
    tags: ['peanut burfi', 'kadalai mittai', 'jaggery candy', 'healthy snack', 'chikki'],
    rating: 4.96,
    reviewCount: 389,
    isFeatured: true,
    isOnSale: true,
    isBestSeller: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Artisanal Batch Roasting & Syrup Cooking',
    purity: 'Zero White Sugar — 100% Pure Jaggery & Peanuts',
    shelfLife: '4 Months from Batch Date',
    origin: 'Kovilpatti / Kangeyam',
    weightVariants: generateVariants(260, ['200ml', '500ml', '1L', '5Kg'], true),
    benefits: [
      'High plant-based protein snack for growing children and fitness enthusiasts',
      'Rich in natural iron from organic jaggery prevents anemia and lethargy',
      'Zero refined sugar, corn syrup, or synthetic gelatin additives',
      'Contains healthy fats, dietary fiber, and essential minerals',
      'Ideal school snack box companion and festive gifting delicacy',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '520 kcal', dailyValue: '26%' },
      { nutrient: 'Protein', amountPer100g: '18.4 g', dailyValue: '37%' },
      { nutrient: 'Carbohydrates', amountPer100g: '54.2 g', dailyValue: '18%' },
      { nutrient: 'Natural Sugars (Jaggery)', amountPer100g: '38.5 g', dailyValue: '—' },
      { nutrient: 'Total Fat', amountPer100g: '27.1 g', dailyValue: '35%' },
      { nutrient: 'Dietary Fiber', amountPer100g: '5.8 g', dailyValue: '23%' },
      { nutrient: 'Iron', amountPer100g: '4.8 mg', dailyValue: '27%' },
    ],
    createdAt: '2025-01-22T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
  },

  // 10. Oil Cake — Nisha Pure Oils
  {
    id: 'prod-oilcake-nisha',
    name: 'Nisha Pure Organic Groundnut & Sesame Oil Cake (Pinnakku)',
    slug: 'nisha-organic-groundnut-sesame-oil-cake',
    description:
      'Nutrient-dense solid residue produced from our cold wooden press extraction of groundnuts and sesame. 100% natural, free from chemical hexane extraction. Highly recommended for increasing milk fat in dairy cattle and serving as an elite nitrogen-rich organic soil fertilizer.',
    shortDescription: 'High-protein organic cattle feed cake & nitrogen-rich bio-fertilizer for organic farming.',
    price: 180,
    compareAtPrice: 210,
    discount: 14,
    sku: 'NPO-OIC-010',
    stock: 90,
    thumbnail: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-oic-1', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'cat-oilcake',
    category: MOCK_CATEGORIES[9],
    brand: 'Nisha Pure Oils',
    tags: ['oil cake', 'pinnakku', 'cattle feed', 'organic fertilizer', 'dairy farming'],
    rating: 4.88,
    reviewCount: 95,
    isFeatured: false,
    isOnSale: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Mechanical Cold Press Residue — No Chemicals',
    purity: '100% Pure Organic Agro Cake',
    shelfLife: '6 Months (Store in dry cool space)',
    origin: 'Kangeyam Agro Hub',
    weightVariants: generateVariants(180, ['5Kg', '15Kg'], true),
    benefits: [
      'Increases SNF and milk fat content in dairy cows and buffaloes',
      'Provides 45%+ crude protein and essential amino acids for livestock',
      'Acts as superior slow-release nitrogen bio-fertilizer for gardens and crops',
      'Improves soil humus, earthworm population, and moisture retention',
      'Completely free of urea, synthetic additives, and mold',
    ],
    nutritionalInfo: [
      { nutrient: 'Crude Protein', amountPer100g: '46.2%', dailyValue: '—' },
      { nutrient: 'Crude Fiber', amountPer100g: '6.8%', dailyValue: '—' },
      { nutrient: 'Residual Oil Fat', amountPer100g: '7.5%', dailyValue: '—' },
      { nutrient: 'Nitrogen (N) for soil', amountPer100g: '7.3%', dailyValue: '—' },
      { nutrient: 'Phosphorus (P2O5)', amountPer100g: '1.5%', dailyValue: '—' },
      { nutrient: 'Potassium (K2O)', amountPer100g: '1.3%', dailyValue: '—' },
    ],
    createdAt: '2025-01-24T00:00:00Z',
    updatedAt: '2025-02-16T00:00:00Z',
  },

  // 11. Groundnut Oil — Varshini Gold
  {
    id: 'prod-groundnut-varshini',
    name: 'Varshini Gold Filtered Groundnut Cooking Oil',
    slug: 'varshini-gold-filtered-groundnut-oil',
    description:
      'Double-filtered pure groundnut oil designed for modern daily cooking. Golden clear clarity, mild pleasant aroma, and superior heat resistance. Ideal for curries, dosas, pooris, and everyday South Indian cooking.',
    shortDescription: 'Double-filtered golden groundnut oil with balanced aroma for everyday family cooking.',
    price: 240,
    compareAtPrice: 280,
    discount: 14,
    sku: 'VG-GNO-011',
    stock: 150,
    thumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-v-gno-1', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'cat-groundnut',
    category: MOCK_CATEGORIES[0],
    brand: 'Varshini Gold',
    tags: ['filtered oil', 'varshini gold', 'groundnut oil', 'everyday cooking'],
    rating: 4.81,
    reviewCount: 230,
    isFeatured: false,
    isOnSale: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Cold Filtered Modern Extraction',
    smokePoint: '220°C',
    purity: '100% Groundnut Seed Oil',
    shelfLife: '9 Months',
    origin: 'Erode, Tamil Nadu',
    weightVariants: generateVariants(240, ['500ml', '1L', '2L', '5L', '15L', '15Kg']),
    benefits: [
      'Carefully filtered to remove suspended sediments while preserving nutrition',
      'Consistent golden color and delightful taste in curries and stir-fries',
      'Enriched with natural phytosterols for heart wellness',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '900 kcal', dailyValue: '45%' },
      { nutrient: 'Total Fat', amountPer100g: '100 g', dailyValue: '128%' },
      { nutrient: 'MUFA', amountPer100g: '47 g', dailyValue: '—' },
      { nutrient: 'Cholesterol', amountPer100g: '0 mg', dailyValue: '0%' },
    ],
    createdAt: '2025-01-25T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },

  // 12. Sesame Oil — Varshini Gold
  {
    id: 'prod-sesame-varshini',
    name: 'Varshini Gold Premium Gingelly Cooking Oil',
    slug: 'varshini-gold-premium-gingelly-cooking-oil',
    description:
      'Refined yet aromatic sesame oil under the Varshini Gold marque. Perfect balance of traditional gingelly savor with light texture. Ideal for pickle preservation, rice dishes, gravies, and aromatic marinades.',
    shortDescription: 'Golden clear premium gingelly oil for pickle preservation, gravies, and flavorful cooking.',
    price: 430,
    compareAtPrice: 480,
    discount: 10,
    sku: 'VG-SES-012',
    stock: 75,
    thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-v-ses-1', url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'cat-sesame',
    category: MOCK_CATEGORIES[2],
    brand: 'Varshini Gold',
    tags: ['varshini gold', 'sesame oil', 'gingelly oil', 'pickle oil'],
    rating: 4.84,
    reviewCount: 160,
    isFeatured: false,
    isOnSale: false,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Gentle Cold Extraction & Clarification',
    smokePoint: '210°C',
    purity: 'Pure Sesame Seed Oil',
    shelfLife: '12 Months',
    origin: 'Tiruppur, Tamil Nadu',
    weightVariants: generateVariants(430, ['500ml', '1L', '2L', '5L', '15L']),
    benefits: [
      'Superior shelf life makes it the gold standard for traditional pickles',
      'Smooth non-bitter finish adds savor without overpowering delicate foods',
      'Naturally rich in antioxidant lignans and polyunsaturated fats',
    ],
    nutritionalInfo: [
      { nutrient: 'Energy', amountPer100g: '900 kcal', dailyValue: '45%' },
      { nutrient: 'Total Fat', amountPer100g: '100 g', dailyValue: '128%' },
    ],
    createdAt: '2025-01-26T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },

  // 13. Lamp Oil — Varshini Gold
  {
    id: 'prod-lamp-varshini',
    name: 'Varshini Gold Deepam Oil (Aromatic Spiritual Oil)',
    slug: 'varshini-gold-deepam-aromatic-lamp-oil',
    description:
      'Specially compounded deepam oil crafted for sustained long-duration burning in temples, prayer rooms, and festivals. Infused with natural camphor and sandal notes that awaken spiritual positivity with clean burning.',
    shortDescription: 'Long-lasting fragrant pooja lamp oil with divine temple aroma and smoke-free flame.',
    price: 195,
    compareAtPrice: 230,
    discount: 15,
    sku: 'VG-LMP-013',
    stock: 220,
    thumbnail: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=700&auto=format&fit=crop&q=80',
    images: [
      { id: 'img-v-lmp-1', url: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=900&auto=format&fit=crop&q=80', isPrimary: true, sortOrder: 0 },
    ],
    categoryId: 'cat-lamp',
    category: MOCK_CATEGORIES[4],
    brand: 'Varshini Gold',
    tags: ['deepam oil', 'varshini gold', 'puja oil', 'temple lamp', 'aroma'],
    rating: 4.89,
    reviewCount: 290,
    isFeatured: false,
    isOnSale: true,
    status: ProductStatus.ACTIVE,
    extractionMethod: 'Specially Blended Vegetable Base with Sacred Aromatics',
    purity: 'Non-Toxic Vegetable Lamp Fuel',
    shelfLife: '24 Months',
    origin: 'Erode, Tamil Nadu',
    weightVariants: generateVariants(195, ['500ml', '1L', '2L', '5L', '15L']),
    benefits: [
      'Steady, long-burning flame ideal for Akhanda Deepams and Karthigai Deepam',
      'Calming camphor and floral scent spreads divinity throughout the home',
      'Keeps lamp wicks lit without flickering or premature charring',
    ],
    nutritionalInfo: [
      { nutrient: 'Classification', amountPer100g: 'Non-edible Pooja Fuel', dailyValue: '—' },
    ],
    createdAt: '2025-01-28T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
  },
];

const SF_PRODUCTS_KEY = 'shopzone_products_v1';
const SF_CATEGORIES_KEY = 'shopzone_categories_v1';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly api = inject(ApiService);

  private getActiveProducts(): Product[] {
    if (typeof window !== 'undefined') {
      try {
        const sfData = localStorage.getItem(SF_PRODUCTS_KEY);
        if (sfData) {
          const parsed = JSON.parse(sfData);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }

        // Cross-app sync: check if admin panel saved modified products
        const adminData = localStorage.getItem('nisha_admin_products_v1');
        if (adminData) {
          const adminProducts = JSON.parse(adminData);
          if (Array.isArray(adminProducts) && adminProducts.length > 0) {
            // Map admin product changes (e.g. prices, stock) to storefront products
            const adminMap = new Map<string, any>(adminProducts.map((p: any) => [p.id, p]));
            const merged = MOCK_PRODUCTS.map(mockProd => {
              const adminProd = adminMap.get(mockProd.id);
              if (!adminProd) return mockProd;

              // Synchronize price, stock, and enabled variants
              const updatedVariants = mockProd.weightVariants?.map(wv => {
                const matchingAdminVar = (adminProd.variants || []).find((v: any) => v.size === wv.code);
                if (matchingAdminVar) {
                  return {
                    ...wv,
                    price: matchingAdminVar.sellingPrice,
                    compareAtPrice: matchingAdminVar.mrp || wv.compareAtPrice,
                    stock: matchingAdminVar.stockQuantity,
                    enabled: matchingAdminVar.isEnabled
                  };
                }
                return wv;
              });

              return {
                ...mockProd,
                name: adminProd.name || mockProd.name,
                description: adminProd.description || mockProd.description,
                price: adminProd.minPrice || mockProd.price,
                compareAtPrice: adminProd.maxPrice || mockProd.compareAtPrice,
                stock: adminProd.totalStock ?? mockProd.stock,
                weightVariants: updatedVariants || mockProd.weightVariants
              };
            });
            return merged;
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

  getProducts(filter?: ProductFilter): Observable<PaginatedResponse<Product>> {
    return this.api
      .get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS.LIST, filter as Record<string, unknown>)
      .pipe(
        map((res) => {
          if (res?.data?.items && res.data.items.length > 0) {
            return res.data;
          }
          return this.filterMockProducts(filter);
        }),
        catchError(() => of(this.filterMockProducts(filter))),
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.api
      .get<Product>(API_ENDPOINTS.PRODUCTS.DETAIL(id))
      .pipe(
        map((res) => {
          if (res?.data) return res.data;
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
    return of(this.getActiveProducts().filter((p) => p.isFeatured));
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
