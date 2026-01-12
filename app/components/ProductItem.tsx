import {memo} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

type ProductWithOptionalPricing =
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;

function getCompareAtMinPrice(
  product: ProductWithOptionalPricing,
): MoneyV2 | undefined {
  const maybeCompareAt = (product as unknown as {
    compareAtPriceRange?: {minVariantPrice?: MoneyV2 | null} | null;
  })?.compareAtPriceRange?.minVariantPrice;

  return maybeCompareAt ?? undefined;
}

function getSubtitle(product: ProductWithOptionalPricing): string | undefined {
  const maybe = product as unknown as {
    productType?: string | null;
    vendor?: string | null;
  };

  return maybe.productType ?? maybe.vendor ?? undefined;
}

export const ProductItem = memo(function ProductItem({
  product,
  loading,
}: {
  product: ProductWithOptionalPricing;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);

  const minPrice = product.priceRange?.minVariantPrice;
  const compareAt = getCompareAtMinPrice(product);

  const minAmount = minPrice ? Number.parseFloat(minPrice.amount) : Number.NaN;
  const compareAtAmount = compareAt
    ? Number.parseFloat(compareAt.amount)
    : Number.NaN;

  const hasDiscount =
    Number.isFinite(minAmount) &&
    Number.isFinite(compareAtAmount) &&
    compareAtAmount > minAmount;

  const salePercent = hasDiscount
    ? Math.round(((compareAtAmount - minAmount) / compareAtAmount) * 100)
    : undefined;

  const subtitle = getSubtitle(product);
  const featuredImage = product.featuredImage ?? undefined;

  return (
    <Link
      to={variantUrl}
      prefetch="intent"
      aria-label={product.title ? `View ${product.title}` : 'View product'}
      className="group block h-full focus:outline-none"
    >
      <div className="h-full w-full overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition duration-200 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <div className="relative rounded-md bg-secondary p-4">
          {salePercent != null ? (
            <span className="absolute right-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground shadow-sm">
              {salePercent}% OFF
            </span>
          ) : null}

          {subtitle ? (
            <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-background/70 px-3 py-1 text-xs font-medium text-foreground ring-1 ring-border backdrop-blur">
              {subtitle}
            </span>
          ) : null}

          <div className="aspect-square w-full">
            {featuredImage ? (
              <Image
                data={featuredImage}
                alt={featuredImage.altText || product.title || 'Product image'}
                loading={loading}
                className="h-full w-full object-contain transition-transform duration-300 will-change-transform group-hover:scale-[1.03]"
                sizes="(min-width: 64em) 260px, (min-width: 48em) 33vw, 50vw"
              />
            ) : (
              <div aria-hidden className="h-full w-full rounded-md bg-muted" />
            )}
          </div>
        </div>

        <div className="px-4 pb-4 pt-4">
          <h3 className="text-base font-semibold text-foreground line-clamp-2 md:text-[18px]">
            {product.title}
          </h3>

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              {hasDiscount && compareAt ? (
                <div className="text-sm text-muted-foreground line-through">
                  <Money data={compareAt} />
                </div>
              ) : null}
              {minPrice ? (
                <div className="text-lg font-bold text-foreground md:text-xl">
                  <Money data={minPrice} />
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Price unavailable</div>
              )}
            </div>

            <span className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors duration-200 group-hover:bg-primary/90 group-hover:ring-2 group-hover:ring-ring">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});
