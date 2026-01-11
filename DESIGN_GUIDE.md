# AODOUR Bags Store - Design & Feature Guide

## Color Scheme
Your luxury brand uses a sophisticated color palette:

- **Primary Color**: #2c3e50 (Dark blue-grey) - Main text, headers, primary elements
- **Secondary Color**: #d4af37 (Gold) - Accents, highlights, premium feel
- **Accent Color**: #c19a6b (Bronze) - Alternative accents
- **Light Background**: #f9f9f9 (Off-white) - Section backgrounds
- **Text**: #333 (Dark grey) - Body text
- **Light Text**: #666 (Medium grey) - Secondary information

## Navigation Structure

### Header Navigation
```
AODOUR (Logo) | Women's Bags | Men's Bags | Travel Bags | Accessories | Sale | [Search] [Account] [Cart]
```

### Footer Navigation
```
About AODOUR          | Shop                    | Customer Care           | About
- Our Story          | - Women's Bags         | - Contact Us           | - Our Story
- Quality Promise    | - Men's Bags           | - Shipping Info        | - Quality Promise
- Careers            | - Travel Bags          | - Returns              | - Blog
                     | - Accessories          | - Size Guide           | - Careers
                     | - Sale                 | - FAQ                  |

[Social Icons: Facebook, Instagram, Twitter]

© 2025 AODOUR.PK | [Trust Badges: Secure, Authentic, Free Shipping] | [Payment: VISA, MC, COD]
```

## Page Layouts

### Homepage
```
┌─────────────────────────────────────────┐
│         HERO SECTION                    │
│  Elegance Meets Functionality           │
│  Premium quality bags...                │
│  [Shop Now] [New Arrivals]              │
│  [Hero Image]                           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  SHOP BY CATEGORY                       │
│  ┌──────────┐ ┌──────────┐             │
│  │ 👜       │ │ 💼       │             │
│  │Women's   │ │Men's     │             │
│  │Bags      │ │Bags      │             │
│  └──────────┘ └──────────┘             │
│  ┌──────────┐ ┌──────────┐             │
│  │ 🧳       │ │ 👛       │             │
│  │Travel    │ │Acces-    │             │
│  │Bags      │ │sories    │             │
│  └──────────┘ └──────────┘             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  FEATURED COLLECTION                    │
│  [Large Hero Image] > Explore           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  BESTSELLERS                            │
│  [Product] [Product] [Product] [Product]│
│  View All Products                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  WHY SHOP AODOUR                        │
│  ✓ Authentic  🚚 Free Shipping          │
│  ↻ Easy Returns  🔒 Secure Payment      │
└─────────────────────────────────────────┘
```

### Product Page
```
┌──────────────────┬──────────────────┐
│   GALLERY        │   PRODUCT INFO   │
│ [Main Image]     │ Title            │
│ [Thumbnail]      │ Price            │
│ [Thumbnail]      │ Form             │
│ [Thumbnail]      │ ✓ Authentic      │
│                  │ 🚚 Free Shipping │
│                  │ ↻ Returns        │
│                  │ Add to Cart      │
│                  │ Description      │
└──────────────────┴──────────────────┘
```

### Product Card
```
┌─────────────────┐
│ [Image 3:4]     │
│ [New Badge]     │ ← Gold
│ [Sale Badge]    │ ← Red
│ Quick View ⟶    │ (Hover effect)
├─────────────────┤
│ Product Title   │
│ Price           │
└─────────────────┘
```

## Features & Components

### 1. Hero Section
- Full-width attention-grabbing banner
- Compelling headline with brand promise
- Dual CTA buttons (Shop Now, New Arrivals)
- Hero image placeholder with gradient

### 2. Featured Categories
- 4-card grid (responsive: 1→2→4 columns)
- Each card has icon, title, description
- Hover effect: slide up + shadow increase
- Links to category collections

### 3. Product Display
- Changed aspect ratio from 1:1 to 3:4 for bags
- Product badges system:
  - **New**: Gold (#d4af37) - for recently added items
  - **Sale**: Red (#e74c3c) - for discounted products
  - **Bestseller**: Green (#27ae60) - for popular items
- Quick-view overlay on hover
- Improved typography and spacing

### 4. Product Gallery
- Primary image display (3:4 aspect)
- Thumbnail selector grid
- Click any thumbnail to view in main area
- Active thumbnail highlighting
- Smooth transitions

### 5. Trust Section
- 4-column grid showcasing brand promises
- Icons with descriptions
- Responsive layout for mobile

## Responsive Design

### Breakpoints
- **Mobile**: < 560px (35em)
- **Tablet**: 560px - 768px (35em - 48em)
- **Desktop**: > 768px (48em)

### Key Responsive Changes
- Hero section: Single column (mobile) → Two columns (desktop)
- Product grid: 2 columns (mobile) → 4 columns (desktop)
- Category cards: 1 column (mobile) → 2 columns (tablet) → 4 columns (desktop)
- Header: Hamburger menu (mobile) → Full menu (desktop)

## Animations & Interactions

### Hover Effects
- Product cards: Lift up (-5px) with enhanced shadow
- Category cards: Similar lift + border color change
- Images: Subtle zoom (1.05x scale)
- Links: Smooth color transition to secondary color

### Transitions
- Default transition: 300ms ease
- Fast transitions (buttons, hovers): 150ms ease
- All transforms use GPU acceleration

## Typography

### Font Stack
- **Headings**: Playfair Display (serif) or Georgia fallback
- **Body**: Inter (sans-serif) or system fonts fallback

### Sizing
- H1: 2rem to 3.5rem (fluid)
- H2: 1.75rem to 2.5rem (fluid)
- H3: 1.1rem to 1.25rem
- Body: 0.9rem to 1rem
- Small: 0.75rem to 0.875rem

## Spacing Standards
```
XS: 0.5rem  (8px)
SM: 1rem    (16px)
MD: 1.5rem  (24px)
LG: 2rem    (32px)
XL: 3rem    (48px)
```

## Button Styles

### Primary Button
- Background: Primary color (#2c3e50)
- Text: White
- Hover: Darker shade + lift effect

### Secondary Button
- Background: Transparent
- Border: Primary color
- Hover: Solid background

### Outline Button
- Background: Transparent
- Border: Light grey
- Hover: Border + text change to primary

### Light Button
- Background: White
- Text: Primary color
- Hover: Background changes to secondary (gold)

## Performance Features

✓ Lazy loading on product images
✓ Optimized image sizes via srcset
✓ CSS variables for fast theme changes
✓ Smooth animations without janky reflows
✓ Sticky positioning for better UX
✓ Responsive grid layouts

## Accessibility

✓ Proper semantic HTML (header, nav, section, footer)
✓ ARIA labels on interactive elements
✓ Keyboard navigation support
✓ Color contrast meets WCAG standards
✓ Image alt text throughout
✓ Form labels properly associated

## Next Steps to Customize

1. **Update Hero Image**: Replace placeholder with actual lifestyle product image
2. **Add Real Products**: Connect to Shopify catalog
3. **Customize Collections**: Create collections for each category
4. **Update Social Links**: Add actual AODOUR social media URLs
5. **Add Logo Image**: Replace text logo with actual brand logo
6. **Implement Filters**: Add price, color, material filters to collections
7. **Add Size Guide**: Create size guide modal
8. **Configure Payment**: Set up payment methods
9. **Setup Analytics**: Connect to Shopify Analytics dashboard
10. **Add Blog**: Create content for the blog section

---

**Ready to launch your luxury bags store! 🛍️**
