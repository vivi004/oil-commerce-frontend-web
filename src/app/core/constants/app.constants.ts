export const APP_CONSTANTS = {
  APP_NAME: 'Nisha Pure Oils',
  APP_TAGLINE: '100% Pure Cold-Pressed & Wood Churned Oils',
  COMPANY_NAME: 'Nisha Pure Oils & Agro Industries',
  PRIMARY_BRAND: 'Nisha Pure Oils',
  SECONDARY_BRAND: 'Varshini Gold',
  SUPPORT_EMAIL: 'care@nishapureoils.com',
  SUPPORT_PHONE: '+91 98421 88990',
  WHATSAPP_NUMBER: '+919842188990',
  FSSAI_LICENSE: '12423008000456',
  ADDRESS: 'Nisha Pure Oils Mills, Kangeyam Road, Erode, Tamil Nadu 638107, India',

  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],

  // File upload
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_REVIEW: 5,

  // Cart & Pricing
  MAX_CART_ITEM_QUANTITY: 50,
  FREE_SHIPPING_THRESHOLD: 1499,
  DEFAULT_SHIPPING_COST: 70,

  // JWT
  TOKEN_EXPIRY_BUFFER_SECONDS: 60,

  // Debounce
  SEARCH_DEBOUNCE_MS: 350,
  SCROLL_DEBOUNCE_MS: 100,

  // Toast config
  TOAST_DURATION_MS: 4000,
  TOAST_POSITION: 'toast-top-right',

  // Rating
  MAX_RATING: 5,

  // Routes
  ROUTES: {
    HOME:           '/',
    ABOUT:          '/about',
    BRANDS:         '/brands',
    CATEGORIES:     '/categories',
    PRODUCTS:       '/products',
    CART:           '/cart',
    CHECKOUT:       '/checkout',
    PAYMENT:        '/payment',
    ORDER_SUCCESS:  '/order-success',
    ORDERS:         '/orders',
    PROFILE:        '/profile',
    ADDRESSES:      '/addresses',
    CONTACT:        '/contact',
    WISHLIST:       '/wishlist',
    LOGIN:          '/auth/login',
    REGISTER:       '/auth/register',
    FORGOT_PASSWORD:'/auth/forgot-password',
  },
} as const;
