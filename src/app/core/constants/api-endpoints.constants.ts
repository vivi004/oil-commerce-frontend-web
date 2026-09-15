export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN:           '/auth/login',
    REGISTER:        '/auth/register',
    LOGOUT:          '/auth/logout',
    REFRESH:         '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD:  '/auth/reset-password',
    VERIFY_EMAIL:    '/auth/verify-email',
    ME:              '/auth/me',
  },

  // Users
  USERS: {
    PROFILE:          '/users/profile',
    UPDATE_PROFILE:   '/users/profile',
    CHANGE_PASSWORD:  '/users/change-password',
    UPLOAD_AVATAR:    '/users/avatar',
  },

  // Products
  PRODUCTS: {
    LIST:    '/products',
    DETAIL:  (id: string) => `/products/${id}`,
    SEARCH:  '/products/search',
    FEATURED:'/products/featured',
    RELATED: (id: string) => `/products/${id}/related`,
  },

  // Categories
  CATEGORIES: {
    LIST:   '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
    TREE:   '/categories/tree',
  },

  // Cart
  CART: {
    GET:          '/cart',
    ADD:          '/cart/items',
    UPDATE:       (itemId: string) => `/cart/items/${itemId}`,
    REMOVE:       (itemId: string) => `/cart/items/${itemId}`,
    CLEAR:        '/cart/clear',
    APPLY_COUPON: '/cart/coupon',
  },

  // Orders
  ORDERS: {
    LIST:   '/orders',
    DETAIL: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    RETURN: (id: string) => `/orders/${id}/return`,
    TRACK:  (id: string) => `/orders/${id}/tracking`,
  },

  // Addresses
  ADDRESSES: {
    LIST:       '/addresses',
    CREATE:     '/addresses',
    UPDATE:     (id: string) => `/addresses/${id}`,
    DELETE:     (id: string) => `/addresses/${id}`,
    SET_DEFAULT:(id: string) => `/addresses/${id}/default`,
  },

  // Wishlist
  WISHLIST: {
    LIST:   '/wishlist',
    ADD:    '/wishlist',
    REMOVE: (productId: string) => `/wishlist/${productId}`,
    CHECK:  (productId: string) => `/wishlist/check/${productId}`,
  },

  // Reviews
  REVIEWS: {
    LIST:        (productId: string) => `/products/${productId}/reviews`,
    CREATE:      (productId: string) => `/products/${productId}/reviews`,
    MY_REVIEWS:  '/reviews/mine',
    HELPFUL:     (reviewId: string) => `/reviews/${reviewId}/helpful`,
  },

  // Notifications
  NOTIFICATIONS: {
    LIST:     '/notifications',
    MARK_READ:(id: string) => `/notifications/${id}/read`,
    MARK_ALL: '/notifications/read-all',
    UNREAD_COUNT: '/notifications/unread-count',
  },

  // Payment
  PAYMENT: {
    METHODS:  '/payment/methods',
    INITIATE: '/payment/initiate',
    VERIFY:   '/payment/verify',
  },

  // Support
  SUPPORT: {
    CREATE_TICKET: '/support/tickets',
    LIST_TICKETS:  '/support/tickets',
    DETAIL:        (id: string) => `/support/tickets/${id}`,
  },
} as const;
