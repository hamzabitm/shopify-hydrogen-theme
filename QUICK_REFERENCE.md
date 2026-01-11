# AODOUR Bags Store - Quick Reference

## 🚀 Quick Start
```bash
cd /workspaces/hydrogen
npm run dev
```
Visit: **http://localhost:3000/**

---

## 📁 Key Files

| File | Purpose | Edit For |
|------|---------|----------|
| `app/styles/app.css` | All styling & design system | Colors, layout, fonts |
| `app/components/Header.tsx` | Top navigation | Logo, menu items |
| `app/components/Footer.tsx` | Footer content | Links, social media |
| `app/routes/($locale)._index.tsx` | Homepage | Hero, categories, featured |
| `app/routes/($locale).products.$handle.tsx` | Product page | Product layout |
| `app/components/ProductItem.tsx` | Product cards | Badges, styling |
| `app/components/ProductGallery.tsx` | Image gallery | NEW component |

---

## 🎨 Brand Colors

```
Primary:    #2c3e50  (Dark blue-grey)
Secondary:  #d4af37  (Gold)
Accent:     #c19a6b  (Bronze)
Text:       #333     (Dark)
Light BG:   #f9f9f9  (Off-white)
```

---

## 📱 Responsive Breakpoints

```
Mobile:  < 560px
Tablet:  560px - 768px
Desktop: > 768px
```

---

## 🔄 Common Changes

### Change Header Logo
**File**: `app/components/Header.tsx` (line ~25)
```tsx
// Replace this:
<span className="header-logo-main">AODOUR</span>
// With image:
<img src="/logo.png" alt="AODOUR" height="40" />
```

### Update Colors
**File**: `app/styles/app.css` (line ~11)
```css
--color-primary: #yourcolor;
--color-secondary: #yourgold;
```

### Change Category Links
**File**: `app/routes/($locale)._index.tsx` (line ~112)
```tsx
handle: 'your-collection-handle'
```

### Update Footer Links
**File**: `app/components/Footer.tsx` (line ~45)
```tsx
<NavLink to="/pages/your-page" className="footer-link">
  Your Link
</NavLink>
```

---

## 🎯 Content Structure

### Homepage
- Hero Section (headline + CTAs)
- 4 Featured Categories
- Featured Collection
- Bestsellers Grid
- Trust Section

### Product Page
- Image Gallery (+ thumbnails)
- Title & Price
- Variant Options
- Product Features
- Description

### Product Cards
- 3:4 Image
- Badges (New/Sale/Bestseller)
- Quick-view Overlay
- Title & Price

---

## 🏷️ Product Tags

**Add these tags in Shopify:**
- `new` → Shows "New" badge (gold)
- `bestseller` → Shows "Bestseller" badge (green)
- Sale price auto-shows "Sale" badge (red)

---

## 📚 Documentation Files

1. **LAUNCH_SUMMARY.md** - Overview & status
2. **IMPLEMENTATION_SUMMARY.md** - Detailed implementation
3. **DESIGN_GUIDE.md** - Design system & components
4. **CUSTOMIZATION_GUIDE.md** - How-to guide

---

## 🧩 Component Hierarchy

```
App
├── Header
│   ├── Logo
│   ├── Menu
│   └── CTAs (Search, Account, Cart)
├── Routes
│   ├── Homepage
│   │   ├── HeroSection
│   │   ├── FeaturedCategories
│   │   ├── FeaturedCollection
│   │   ├── RecommendedProducts (ProductItem)
│   │   └── TrustSection
│   ├── ProductPage
│   │   ├── ProductGallery
│   │   ├── ProductForm
│   │   └── ProductDescription
│   └── Collections
│       └── ProductItem (Grid)
└── Footer
    ├── BrandSection
    ├── LinksSection
    └── BottomSection
```

---

## ⚡ Performance Tips

- ✅ Images under 200KB
- ✅ Use responsive images
- ✅ Lazy load below-fold content
- ✅ Minimize CSS in critical path
- ✅ Cache static assets

---

## 🔍 SEO Quick Wins

- ✅ Meta titles/descriptions updated
- ✅ Semantic HTML structure
- ✅ Image alt text included
- ✅ Proper heading hierarchy
- ✅ Mobile responsive

---

## 🐛 Troubleshooting

**Port 3000 in use?**
```bash
npm run dev # Auto-tries 3001, 3002, etc.
```

**CSS not updating?**
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh (Ctrl+Shift+R)
- Restart dev server

**Images not loading?**
- Check path in image src
- Verify file exists in public/
- Check browser console for errors

---

## 📞 Quick Links

- Hydrogen Docs: https://shopify.dev/custom-storefronts/hydrogen
- Remix Docs: https://remix.run/docs
- Shopify API: https://shopify.dev/api/storefront

---

## ✅ Pre-Launch Checklist

- [ ] Update logo & favicon
- [ ] Change brand colors if needed
- [ ] Update hero image
- [ ] Configure Shopify store link (`h2 link`)
- [ ] Add real products
- [ ] Set up payment methods
- [ ] Update footer links
- [ ] Configure analytics
- [ ] Test on mobile
- [ ] Test checkout flow
- [ ] Setup SSL certificate
- [ ] Configure domain
- [ ] Deploy to production

---

**Version**: 1.0  
**Status**: ✅ Ready to Customize  
**Launch**: Ready Now  

🎉 **Good luck with AODOUR!** 🎉
