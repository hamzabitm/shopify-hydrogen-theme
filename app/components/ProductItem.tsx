import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  
  // Check if product is on sale
  const hasDiscount = product.priceRange.minVariantPrice.amount !== 
    (product as any).compareAtPriceRange?.minVariantPrice?.amount;
  
  // Check for product tags
  const isNew = (product as any).tags?.includes('new');
  const isBestSeller = (product as any).tags?.includes('bestseller');
  
  // Get sale percentage if on sale
  const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
  const comparePrice = parseFloat((product as any).compareAtPriceRange?.minVariantPrice?.amount || minPrice);
  const salePercent = comparePrice > minPrice ? 
    Math.round(((comparePrice - minPrice) / comparePrice) * 100) : 0;
  
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
      title={`View ${product.title} details`}
    >
      <div className="product-item-image-wrapper">
        {image && (
          <Image
            alt={image.altText || product.title}
            aspectRatio="3/4"
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className="product-item-image"
          />
        )}
        
        {/* Badges */}
        <div className="product-badges">
          {isNew && <span className="product-badge badge-new">New</span>}
          {hasDiscount && salePercent > 0 && (
            <span className="product-badge badge-sale">-{salePercent}%</span>
          )}
          {!hasDiscount && hasDiscount && (
            <span className="product-badge badge-sale">Sale</span>
          )}
          {isBestSeller && <span className="product-badge badge-bestseller">⭐ Best</span>}
        </div>
        
        {/* Quick View Overlay (appears on hover) */}
        <div className="product-item-overlay">
          <span className="quick-view-text">View Details →</span>
        </div>
      </div>
      
      <div className="product-item-details">
        <h4 className="product-item-title">{product.title}</h4>
        
        {/* Price Section */}
        <div className="product-item-price-section">
          <div className="product-item-price">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
          {hasDiscount && comparePrice > minPrice && (
            <div className="product-item-compare-price">
              <Money data={{amount: comparePrice.toString(), currencyCode: product.priceRange.minVariantPrice.currencyCode}} />
            </div>
          )}
        </div>
        
        {/* Availability Badge */}
        <div className="product-availability">
          {(product as any).availableForSale ? (
            <span className="availability-in-stock">In Stock</span>
          ) : (
            <span className="availability-out-of-stock">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
