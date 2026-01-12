import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

type ProductCardImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export interface ProductCardProps {
  /** Minimal product shape used by the card. */
  product: {
    id?: string | null;
    title?: string | null;
    handle?: string | null;
    featuredImage?: ProductCardImage | null;
    images?: {nodes?: Array<ProductCardImage | null>} | null;
    priceRange?: {
      minVariantPrice?: MoneyV2 | null;
      maxVariantPrice?: MoneyV2 | null;
    } | null;
    [key: string]: unknown;
  };

  /** Control image loading behavior. */
  loading?: 'eager' | 'lazy';

  /** @deprecated Use imageHeightClassName instead. */
  imageHeight?: string;

  /** Optional override for the image area height (useful in grids). */
  imageHeightClassName?: string;

  /** @deprecated Not used by the clean card design. */
  subtitle?: string;

  /** @deprecated Not used by the clean card design. */
  badges?: unknown;

  /** @deprecated Not used by the clean card design. */
  quickAddVariantId?: string;
}

export function ProductCard({
  product,
  loading = 'lazy',
  imageHeight,
  imageHeightClassName,
}: ProductCardProps) {
  const {title, handle, featuredImage, priceRange} = product;

  if (!handle) return null;

  const images = (product as any).images?.nodes as
    | Array<ProductCardImage | null>
    | undefined;
  const primaryImage = (images?.find(Boolean) ??
    featuredImage) as ProductCardImage | null | undefined;

  const minPrice = priceRange?.minVariantPrice ?? undefined;
  const maxPrice = priceRange?.maxVariantPrice ?? undefined;
  const isPriceRange =
    !!minPrice && !!maxPrice && maxPrice.amount !== minPrice.amount;

  const productUrl = `/products/${handle}`;
  const resolvedImageHeightClassName =
    imageHeightClassName ?? imageHeight ?? 'h-80';

  return (
    <Link
      to={productUrl}
      prefetch="intent"
      aria-label={title ? `View ${title}` : 'View product'}
      className={
        'group block w-full overflow-hidden rounded-xl ' +
        'border border-slate-200 bg-white ' +
        'shadow-sm transition duration-200 ' +
        'hover:border-sky-200 hover:shadow-lg'
      }
    >
      {/* Image (fixed height to avoid layout shifts) */}
      <div className={'relative ' + resolvedImageHeightClassName + ' bg-slate-50'}>
        <div className="h-full w-full p-6 flex items-center justify-center">
          {primaryImage ? (
            <Image
              data={primaryImage}
              alt={primaryImage.altText || title || 'Product image'}
              loading={loading}
              sizes="(min-width: 64em) 320px, (min-width: 40em) 45vw, 90vw"
              className="h-full w-full object-contain"
            />
          ) : (
            <div aria-hidden className="h-full w-full rounded-lg bg-slate-200" />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-sm font-medium text-slate-900 line-clamp-2">{title}</h3>

        <div className="mt-2 flex items-baseline gap-2">
          {minPrice ? (
            <span className="text-base font-semibold text-slate-900">
              {isPriceRange ? (
                <span className="inline-flex items-baseline gap-2">
                  <span className="text-xs text-slate-500">From</span>
                  <Money data={minPrice} />
                </span>
              ) : (
                <Money data={minPrice} />
              )}
            </span>
          ) : (
            <span className="text-sm text-slate-500">Price unavailable</span>
          )}

          {isPriceRange ? (
            <span className="text-xs text-slate-500">Multiple options</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
