export const environment = {
  production: false,
  appName: 'ShopZone',
  appVersion: '1.0.0',
  apiBaseUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  jwtTokenKey: 'shopzone_access_token',
  jwtRefreshKey: 'shopzone_refresh_token',
  userKey: 'shopzone_user',
  cartKey: 'shopzone_cart',
  enableDevTools: true,
  enableLogging: true,
  imageBaseUrl: 'http://localhost:8080/uploads',
  defaultPageSize: 12,
  maxFileSize: 5242880, // 5MB
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  googleSheetPricingUrl: 'https://docs.google.com/spreadsheets/d/1h2O9GLqQaTVUvU2w0pwBMEu9T8FzJSaqu-pn-KGRce4/edit?usp=sharing',
};
