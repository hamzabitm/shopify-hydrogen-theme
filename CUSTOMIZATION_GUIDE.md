# AODOUR Bags Store - Setup & Customization Guide

## Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Shopify account with Hydrogen setup

### Start Development Server
```bash
cd /workspaces/hydrogen
npm run dev
```

The store will be available at: **http://localhost:3001/**

## File Structure Overview

```
app/
├── components/              # Reusable UI components
│   ├── Header.tsx          # Navigation header (customized for AODOUR)
│   ├── Footer.tsx          # Footer with rich content
│   ├── ProductItem.tsx     # Product card with badges
│   ├── ProductGallery.tsx  # NEW: Multi-image gallery
│   ├── ProductForm.tsx     # Variant selection
│   ├── ProductPrice.tsx    # Price display
│   ├── CartMain.tsx        # Shopping cart
│   └── ...
├── routes/                 # Page routes
│   ├── ($locale)._index.tsx        # Homepage (redesigned)
│   ├── ($locale).products.$handle.tsx  # Product page (enhanced)
│   ├── ($locale).collections.$handle.tsx
│   └── ...
├── lib/                    # Utilities
│   ├── fragments.ts       # GraphQL fragments
│   └── ...
└── styles/
    ├── app.css            # Main styles (completely redesigned)
    ├── reset.css
    └── tailwind.css
```

## Customization Tasks

### 1. Update Company Branding

**Logo** (`app/components/Header.tsx`)
```tsx
// Replace the text logo with an image
<NavLink prefetch="intent" to="/" className="header-logo" end>
  <img src="/logo.png" alt="AODOUR" className="header-logo-image" />
</NavLink>
```

**Add CSS for logo image:**
```css
.header-logo-image {
  height: 40px;
  width: auto;
}
```

**Favicon**: Replace `public/favicon.svg` with your brand favicon

### 2. Update Colors

Edit CSS variables in `app/styles/app.css`:
```css
:root {
  /* Change these to match your brand */
  --color-primary: #2c3e50;        /* Main color */
  --color-primary-dark: #1a252f;
  --color-secondary: #d4af37;      /* Gold accent */
  --color-accent: #c19a6b;         /* Bronze accent */
  
  /* Add more colors as needed */
  --color-custom: #yourcolor;
}
```

### 3. Update Hero Image

Edit `app/routes/($locale)._index.tsx`:
```tsx
function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        {/* Keep existing content */}
      </div>
      <div className="hero-image">
        <img 
          src="/hero-image.jpg" 
          alt="Premium bags" 
          className="hero-image-actual"
        />
      </div>
    </div>
  );
}
```

Update CSS:
```css
.hero-image-actual {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-lg);
}
```

### 4. Update Social Media Links

Edit `app/components/Footer.tsx`:
```tsx
<a href="https://facebook.com/yourusername" className="footer-social-link" target="_blank">
  f
</a>
<a href="https://instagram.com/yourusername" className="footer-social-link" target="_blank">
  📷
</a>
```

### 5. Add Products to Collections

In Shopify Admin:
1. Create collections:
   - Women's Bags
   - Men's Bags
   - Travel Bags
   - Accessories
   - Sale (for discounted items)
   
2. Add product tags:
   - `new` - for new products
   - `bestseller` - for popular items
   - Products with sale prices will automatically show "Sale" badge

### 6. Update Footer Links

Edit `app/components/Footer.tsx` to match your actual pages:
```tsx
<NavLink to="/pages/about" className="footer-link">Our Story</NavLink>
<NavLink to="/pages/shipping" className="footer-link">Shipping Info</NavLink>
<NavLink to="/pages/returns" className="footer-link">Returns</NavLink>
<NavLink to="/pages/size-guide" className="footer-link">Size Guide</NavLink>
<NavLink to="/pages/contact" className="footer-link">Contact Us</NavLink>
```

### 7. Update Homepage Collections

Edit `app/routes/($locale)._index.tsx`:
```tsx
function FeaturedCategories() {
  const categories = [
    {
      title: "Women's Bags",
      handle: 'womens-bags',  // Must match Shopify collection handle
      description: 'Your custom description',
      icon: '👜',
    },
    // ... update other categories
  ];
}
```

### 8. Customize Product Badges

Edit `app/components/ProductItem.tsx` to add logic for badge detection:
```tsx
// Add custom logic based on your product structure
const isNew = (product as any).tags?.includes('new');
const isBestSeller = (product as any).tags?.includes('bestseller');
const hasDiscount = product.priceRange.minVariantPrice.amount !== 
  (product as any).compareAtPriceRange?.minVariantPrice?.amount;
```

### 9. Update Product Page Meta Title

Edit `app/routes/($locale).products.$handle.tsx`:
```tsx
export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `AODOUR | ${data?.product.title ?? ''} - Premium Bags`},
    {
      name: 'description',
      content: `Shop ${data?.product.title ?? ''} at AODOUR. Premium quality bags...`
    }
  ];
};
```

### 10. Update Homepage Meta Tags

Edit `app/routes/($locale)._index.tsx`:
```tsx
export const meta: Route.MetaFunction = () => {
  return [
    {title: 'AODOUR - Premium Luxury Bags | Shop Now'},
    {
      name: 'description',
      content: 'Discover premium quality luxury bags at AODOUR.PK. Shop authentic handbags, backpacks, travel bags, and accessories.'
    }
  ];
};
```

## Adding New Features

### Add Product Filters

1. Create a new component `ProductFilters.tsx`:
```tsx
export function ProductFilters() {
  // Add filter UI here
}
```

2. Update collection page to use filters

### Add Product Reviews

Use an integration like Yotpo or Judge.me:
1. Install the app from Shopify App Store
2. Add review section to product page

### Add Wishlist

1. Create context for wishlist state
2. Add heart button to product items
3. Create wishlist page

### Add Search Filters

1. Create filter sidebar component
2. Add filter state management
3. Update GraphQL queries

## Performance Optimization

### Image Optimization
- Use WebP format where possible
- Optimize images to under 200KB per image
- Use proper aspect ratios (3:4 for bags)

### Code Splitting
- Components are already code-split
- Defer non-critical data loading

### Caching
- Leverage Shopify's CDN
- Set proper cache headers

## SEO Optimization

### Already Implemented
✓ Meta tags on all pages
✓ Structured data
✓ Mobile-friendly design
✓ Fast loading with deferred data
✓ Proper heading hierarchy

### To Add
1. Sitemap: Update `app/routes/($locale).[sitemap.xml].tsx`
2. Robots.txt: Update `app/routes/[robots.txt].tsx`
3. Schema markup for products
4. Open Graph images

## Testing

### Test Locally
```bash
npm run dev
```

### Check Performance
```bash
npm run build
```

### Lint Code
```bash
npm run lint
```

### Fix Formatting
```bash
npm run format
```

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Shopify Oxygen
```bash
shopify hydrogen deploy
```

## Troubleshooting

### Port Already in Use
If port 3000 is busy, the dev server automatically tries port 3001

### CSS Not Updating
- Clear browser cache
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Restart dev server

### Images Not Loading
- Check image file names match
- Verify image URLs are correct
- Check browser console for errors

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Additional Resources

- [Hydrogen Docs](https://shopify.dev/custom-storefronts/hydrogen)
- [Remix Docs](https://remix.run/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Shopify Storefront API](https://shopify.dev/api/storefront)

## Support & Questions

For Hydrogen-specific issues:
- Check official Hydrogen documentation
- Visit Shopify GitHub discussions
- Contact Shopify Support

For AODOUR customizations:
- Review implementation summary for file locations
- Check component prop types
- Use TypeScript for type safety

---

**You're all set to launch AODOUR! Happy selling! 🎉**
