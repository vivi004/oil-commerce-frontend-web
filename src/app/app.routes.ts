import { Routes } from '@angular/router';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // ── Default redirect ─────────────────────────────────────────────────────
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  // ── Auth layout (unauthenticated) ─────────────────────────────────────────
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        title: 'Sign In — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        title: 'Create Account — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'forgot-password',
        title: 'Forgot Password — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent,
          ),
      },
      {
        path: 'reset-password',
        title: 'Reset Password — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent,
          ),
      },
    ],
  },

  // ── Customer layout (main app) ─────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./layouts/customer-layout/customer-layout.component').then(
        (m) => m.CustomerLayoutComponent,
      ),
    children: [
      // Home
      {
        path: 'home',
        title: 'Nisha Pure Oils — 100% Traditional Cold-Pressed Pure Oils',
        loadComponent: () =>
          import('./features/home/home.component').then((m) => m.HomeComponent),
      },

      // About Us
      {
        path: 'about',
        title: 'About Us — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/about/about.component').then((m) => m.AboutComponent),
      },

      // Our Brands
      {
        path: 'brands',
        title: 'Our Brands (Nisha Pure Oils & Varshini Gold) — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/brands/brands.component').then((m) => m.BrandsComponent),
      },

      // Contact Us
      {
        path: 'contact',
        title: 'Contact Us & Mill Desk — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },

      // Products
      {
        path: 'products',
        children: [
          {
            path: '',
            title: 'Pure Oils & Agro Catalog — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/products/product-list/product-list.component').then(
                (m) => m.ProductListComponent,
              ),
          },
          {
            path: 'search',
            title: 'Search Oils & Products — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/products/product-search/product-search.component').then(
                (m) => m.ProductSearchComponent,
              ),
          },
          {
            path: ':id',
            title: 'Product Details — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/products/product-details/product-details.component').then(
                (m) => m.ProductDetailsComponent,
              ),
          },
        ],
      },

      // Categories
      {
        path: 'categories',
        title: 'Oil Categories — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
      },
      {
        path: 'categories/:slug',
        title: 'Category Details — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/categories/categories.component').then((m) => m.CategoriesComponent),
      },

      // Cart
      {
        path: 'cart',
        title: 'Shopping Cart — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/cart/cart.component').then((m) => m.CartComponent),
      },

      // Checkout (Public/Guest or Auth friendly)
      {
        path: 'checkout',
        title: 'Checkout — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
      },

      // Payment
      {
        path: 'payment',
        title: 'Secure Payment — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/payment/payment.component').then((m) => m.PaymentComponent),
      },

      // Order Success
      {
        path: 'order-success',
        title: 'Order Confirmed — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/orders/order-success/order-success.component').then((m) => m.OrderSuccessComponent),
      },

      // Orders
      {
        path: 'orders',
        children: [
          {
            path: '',
            title: 'My Orders — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/orders/order-list/order-list.component').then(
                (m) => m.OrderListComponent,
              ),
          },
          {
            path: 'success/:id',
            title: 'Order Successful — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/orders/order-success/order-success.component').then(
                (m) => m.OrderSuccessComponent,
              ),
          },
          {
            path: ':id',
            title: 'Order Details — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/orders/order-details/order-details.component').then(
                (m) => m.OrderDetailsComponent,
              ),
          },
          {
            path: ':id/tracking',
            title: 'Track Order — Nisha Pure Oils',
            loadComponent: () =>
              import('./features/orders/order-tracking/order-tracking.component').then(
                (m) => m.OrderTrackingComponent,
              ),
          },
        ],
      },

      // Profile
      {
        path: 'profile',
        title: 'My Profile — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },

      // Address
      {
        path: 'addresses',
        title: 'Address Book — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/address/address.component').then((m) => m.AddressComponent),
      },

      // Wishlist
      {
        path: 'wishlist',
        title: 'My Wishlist — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
      },

      // Reviews
      {
        path: 'reviews',
        title: 'My Reviews — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/reviews/reviews.component').then((m) => m.ReviewsComponent),
      },

      // Notifications
      {
        path: 'notifications',
        title: 'Notifications — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/notifications/notifications.component').then(
            (m) => m.NotificationsComponent,
          ),
      },

      // Support
      {
        path: 'support',
        title: 'Help & Support — Nisha Pure Oils',
        loadComponent: () =>
          import('./features/support/support.component').then((m) => m.SupportComponent),
      },
    ],
  },

  // ── 404 ───────────────────────────────────────────────────────────────────
  {
    path: '**',
    title: 'Page Not Found — Nisha Pure Oils',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(
        (m) => m.NotFoundComponent,
      ),
  },
];
