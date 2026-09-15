export const environment = {
  production: true,
  appName: 'ShopZone',
  appVersion: '1.0.0',
  // Replace with your live Render backend URL (e.g. https://<your-service>.onrender.com/api)
  apiBaseUrl: 'https://oil-commerce-backend.onrender.com/api',
  apiTimeout: 30000,
  jwtTokenKey: 'shopzone_access_token',
  jwtRefreshKey: 'shopzone_refresh_token',
  userKey: 'shopzone_user',
  cartKey: 'shopzone_cart',
  enableDevTools: false,
  enableLogging: false,
  imageBaseUrl: 'https://oil-commerce-backend.onrender.com/uploads',
  defaultPageSize: 12,
  maxFileSize: 5242880,
  supportedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
  googleSheetPricingUrl: 'https://docs.google.com/spreadsheets/d/1h2O9GLqQaTVUvU2w0pwBMEu9T8FzJSaqu-pn-KGRce4/edit?usp=sharing',
};
