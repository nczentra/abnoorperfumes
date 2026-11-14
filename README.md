# AB NOOR PERFUMES
### Premium Arabian Luxury Perfume E-Commerce Platform
> **Brand Slogan:** THE ESSENCE OF ELEGANCE  
> **Secondary Line:** Discover Your Signature Fragrance

---

## 🏛️ Project Overview

**AB Noor Perfumes** is a production-ready, full-stack luxury perfume e-commerce and business management platform designed for the highest tier of Middle Eastern and international luxury fragrance retail. The platform provides a seamless, interconnected shopping and management experience comprising three synchronized systems:

1. **Public E-Commerce Boutique:** Editorial luxury storefront, interactive fragrance finder, category realms, product details with three-tiered olfactory pyramids, real-time live search, fragrance comparison matrix, and lifestyle journal.
2. **Customer Account Portal:** Complete patron dashboard featuring order history, live parcel tracking, digital PDF tax invoice generation, bespoke wishlist, multiple shipping address management, and profile settings.
3. **Admin & Store Management Dashboard:** Executive administrative suite providing real-time sales analytics (Recharts), complete product CRUD with variant-level stock management, order fulfillment and courier tracking assignment, category and brand management, coupon rules engine, review moderation queue, hero banners CMS, and CSV data export.

---

## 🎨 Brand Identity & Palette

| Token | Colour | HEX | Purpose |
|---|---|---|---|
| Deep Emerald | Primary Brand | `#103B2D` | Primary brand accent, primary CTA buttons |
| Dark Forest | Premium Sections | `#0B2119` | Hero banners, footer, luxury cards |
| Luxury Gold | Brand Accents | `#C6A15B` | Medallions, badges, icons, borders |
| Soft Gold | Secondary Accents | `#E5D3A3` | Shimmer text, secondary buttons |
| Ivory | Main Background | `#F8F5EF` | Page backgrounds, subtle cards |
| White | Pure White | `#FFFFFF` | Surface cards, modals |
| Charcoal | Primary Text | `#171717` | High contrast headings & text |
| Muted Grey | Secondary Text | `#777777` | Captions, metadata, subtitles |

### Typography
- **Main Headings:** *Playfair Display*
- **Premium Headings:** *Cormorant Garamond*
- **Body & UI Controls:** *Inter*

---

## 🛠️ Technology Architecture

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS with custom luxury color palette and shadows
- **Routing:** React Router DOM (v7) with nested layout routes and role guards
- **State & Context:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `CompareContext`)
- **Icons:** Lucide React
- **Analytics & Charts:** Recharts
- **Toast Notifications:** Sonner
- **Invoice Generation:** jsPDF
- **Celebration Effects:** Canvas Confetti

### Backend & Cloud Services
- **Authentication:** Firebase Authentication (Email/Password, Google Sign-in)
- **Database:** Firebase Cloud Firestore (structured collections with subcollections)
- **File Storage:** Firebase Storage
- **Hosting:** Firebase Hosting with SPA rewrites
- **Cloud Functions:** Node.js 20 functions for server-side trusted price calculation, Razorpay order generation, and payment signature verification
- **Payment Gateway:** Razorpay SDK (Cards, UPI, NetBanking) & Cash on Delivery (COD)

---

## 📂 Project Structure

```
AbNoorPerfumes/
├── dist/                              # Production build output
├── functions/                         # Firebase Cloud Functions
│   ├── src/
│   │   └── index.js                   # Razorpay order creation & signature verification
│   └── package.json
├── public/
│   └── logo/
│       ├── logo.svg                   # Brand monogram logo (dark version)
│       ├── logo-white.svg             # Brand monogram logo (light version)
│       └── favicon.svg                # Brand monogram crest favicon
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/                    # MonogramLogo, StarRating, PinCodeChecker, FragranceNotesPyramid
│   │   ├── layout/                    # Header, AnnouncementBar, Footer, SearchModal, CartDrawer, MobileNavDrawer
│   │   └── product/                   # ProductCard, ProductFilters, QuickViewModal
│   ├── constants/
│   │   ├── brand.js                   # Brand colors, taglines, concentrations, families, order statuses
│   │   └── seedData.js                # Initial rich catalogue data (Oud, Attars, Extraits)
│   ├── context/
│   │   ├── AuthContext.jsx            # User state, Firebase Auth listeners, profile persistence
│   │   ├── CartContext.jsx            # Cart items, free shipping bar, coupons, subtotal
│   │   ├── WishlistContext.jsx        # Saved products persistence
│   │   └── CompareContext.jsx         # 3-product side-by-side comparison state
│   ├── firebase/
│   │   └── config.js                  # Unified Firebase and persistent local-fallback connector
│   ├── layouts/
│   │   ├── PublicLayout.jsx           # Storefront wrapper
│   │   ├── CustomerLayout.jsx         # Patron dashboard wrapper
│   │   └── AdminLayout.jsx            # Admin control center wrapper
│   ├── pages/
│   │   ├── public/                    # Home, Shop, CategoryPage, ProductDetail, FragranceFinder,
│   │   │                              # ComparePage, CartPage, Checkout, OrderSuccess, TrackOrder,
│   │   │                              # About, Contact, FAQ, FragranceGuide, BlogList, BlogDetail, PolicyPages
│   │   ├── auth/                      # Login, Register, ForgotPassword
│   │   ├── customer/                  # AccountOverview, CustomerOrders, CustomerWishlist, CustomerAddresses, CustomerProfile
│   │   └── admin/                     # AdminDashboard, AdminProducts, AdminOrders, AdminCategories,
│   │                                  # AdminBrands, AdminInventory, AdminCoupons, AdminReviews,
│   │                                  # AdminBanners, AdminReports, AdminSettings
│   ├── routes/
│   │   ├── AppRoutes.jsx              # Central router configuration
│   │   ├── ProtectedRoute.jsx         # Customer route guard
│   │   └── AdminRoute.jsx             # Admin route guard
│   ├── services/                      # Modular service layer (productService, orderService, couponService, etc.)
│   ├── styles/
│   │   └── index.css                  # Custom scrollbars, gold shimmer, and Tailwind directives
│   ├── App.jsx                        # Application root with providers
│   └── main.jsx                       # Entry point
├── firestore.rules                    # Production Firestore security rules
├── storage.rules                      # Production Firebase Storage security rules
├── firestore.indexes.json             # Composite query indexes
├── firebase.json                      # Firebase Hosting & Emulator configuration
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### 1. Installation
Install project dependencies:
```bash
npm install
```

### 2. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Populate your credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_RAZORPAY_KEY_ID=rzp_test_YourTestKeyId
```
*(Note: If Firebase credentials are not provided initially, the platform gracefully switches to an integrated persistent local-storage mode populated with authentic initial seed data, allowing immediate testing and demonstration.)*

### 3. Local Development Server
Start the Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

### 4. Production Build
Compile the application bundle:
```bash
npm run build
```

---

## 🔐 Credentials & Quick Preview Access

For immediate testing, quick buttons are available on the Sign In page:

- **Admin Account:** `admin@abnoorperfumes.com` | `admin123`
- **Customer Account:** `patron@example.com` | `patron123`
- **Dev Role Switcher:** Click the role switcher link in the header user menu to toggle between **Admin** and **Customer** modes at any time.

---

## 🚢 Firebase Deployment

To deploy to Firebase Hosting and Cloud Firestore:
```bash
# 1. Login to Firebase CLI
firebase login

# 2. Select your Firebase project
firebase use --add

# 3. Deploy all assets, rules, and cloud functions
firebase deploy
```

---

## 🏆 Key Features Implemented

- [x] **Monogram Brand Identity:** Custom SVG monogram with intertwined A & B crest and tagline "The Essence of Elegance".
- [x] **Luxury Public Storefront:** Dynamic announcement banner, hero carousel, shop by category, featured products, best sellers, new arrivals, Arabian heritage spotlight, and testimonials.
- [x] **Faceted Filtering & Sorting:** Filter by category, brand house, gender, fragrance family, concentration, price range, and sort by rating, popularity, or price.
- [x] **Product Detail Page:** Interactive multi-image gallery, olfactory pyramid (top, middle, base notes), variant selector (10ml to 100ml), longevity and sillage meters, delivery PIN code checker, and customer reviews.
- [x] **Interactive Fragrance Finder Quiz:** 4-step recommendation engine matching user preferences to specific catalogue formulations.
- [x] **Side-by-Side Comparison Matrix:** Compare up to 3 perfumes simultaneously across notes, sillage, longevity, and price.
- [x] **Cart & Checkout:** Real-time subtotal, free shipping progress bar, promo coupon engine, delivery address validation, Razorpay online payment & Cash on Delivery.
- [x] **Order Success & PDF Invoice:** Confetti celebration, itemized receipt, and automatic downloadable formal PDF tax invoices using `jsPDF`.
- [x] **Order Tracking:** Lookup order status, tracking number, courier partner (Blue Dart), and visual shipment timeline.
- [x] **Customer Portal:** Dedicated patron dashboard with orders, wishlist, saved addresses, and profile management.
- [x] **Admin Dashboard:** Recharts analytics, product CRUD, orders management with status updates, category and brand management, variant inventory adjustments with audit logs, coupon manager, review moderation queue, hero banners CMS, and CSV export.
- [x] **Firebase Security:** Production-grade `firestore.rules`, `storage.rules`, `firestore.indexes.json`, and server-side Cloud Functions.
