import {memo, useEffect, useMemo, useState} from 'react';
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {ShoppingBag, Heart, Eye, GitCompareArrows, Star} from 'lucide-react';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {AddToCartButton} from './AddToCartButton';

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

function getColorValueFromVariant(variant: any): string | undefined {
  const opts = variant?.selectedOptions as
    | Array<{name?: string | null; value?: string | null}>
    | undefined;
  if (!opts?.length) return undefined;
  const match = opts.find((o) => {
    const name = String(o?.name ?? '').toLowerCase();
    return name === 'color' || name === 'colour';
  });
  const value = match?.value;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function toSwatchColor(value: string): string {
  const raw = value.trim();
  if (raw.startsWith('#')) return raw;
  const key = raw.toLowerCase();
  const map: Record<string, string> = {
    black: '#0b0f14',
    graphite: '#111827',
    gray: '#9ca3af',
    grey: '#9ca3af',
    white: '#f8fafc',
    silver: '#cbd5e1',
    gold: '#d4a574',
    red: '#ef4444',
    blue: '#3b82f6',
    navy: '#0f172a',
    green: '#22c55e',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    yellow: '#facc15',
    teal: '#14b8a6',
    cyan: '#22d3ee',
    beige: '#e7dcc8',
    brown: '#8b5a2b',
  };
  return map[key] ?? raw;
}

export const ProductItem = memo(function ProductItem({
  product,
  loading,
}: {
  product: ProductWithOptionalPricing;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    undefined,
  );

  const [showAllVariants, setShowAllVariants] = useState(false);

  const variants = useMemo(() => {
    const anyProduct = product as any;
    const nodes = anyProduct?.variants?.nodes;
    if (Array.isArray(nodes)) return nodes.filter(Boolean);
    const edges = anyProduct?.variants?.edges;
    if (Array.isArray(edges)) {
      return edges.map((e: any) => e?.node).filter(Boolean);
    }
    return [] as any[];
  }, [product]);

  const initialVariantId = useMemo(() => {
    const anyProduct = product as any;
    return (
      anyProduct?.selectedOrFirstAvailableVariant?.id ??
      variants?.find((v: any) => v?.availableForSale)?.id ??
      variants?.find(Boolean)?.id
    );
  }, [product, variants]);

  useEffect(() => {
    setSelectedVariantId(initialVariantId);
    setShowAllVariants(false);
  }, [initialVariantId]);

  const selectedVariant = useMemo(() => {
    const anyProduct = product as any;
    return (
      variants.find((v: any) => v?.id === selectedVariantId) ??
      anyProduct?.selectedOrFirstAvailableVariant ??
      variants?.find(Boolean)
    );
  }, [product, selectedVariantId, variants]);

  const minPrice = product.priceRange?.minVariantPrice;
  const maxPrice = (product as any)?.priceRange?.maxVariantPrice as
    | MoneyV2
    | undefined;
  const compareAt = getCompareAtMinPrice(product);

  const displayPrice =
    (selectedVariant as any)?.price ??
    (selectedVariant as any)?.priceV2 ??
    minPrice;
  const displayCompareAt =
    (selectedVariant as any)?.compareAtPrice ??
    (selectedVariant as any)?.compareAtPriceV2 ??
    compareAt;

  const priceAmount = displayPrice
    ? Number.parseFloat(displayPrice.amount)
    : Number.NaN;
  const compareAtAmount = displayCompareAt
    ? Number.parseFloat(displayCompareAt.amount)
    : Number.NaN;

  const hasDiscount =
    Number.isFinite(priceAmount) &&
    Number.isFinite(compareAtAmount) &&
    compareAtAmount > priceAmount;

  const salePercent = hasDiscount
    ? Math.round(((compareAtAmount - priceAmount) / compareAtAmount) * 100)
    : undefined;

  const subtitle = getSubtitle(product);
  const featuredImage = product.featuredImage ?? undefined;
  const displayImage =
    (selectedVariant as any)?.image ??
    (selectedVariant as any)?.featuredImage ??
    featuredImage;

  const isPriceRange =
    !!minPrice &&
    !!maxPrice &&
    Number.isFinite(Number.parseFloat(maxPrice.amount)) &&
    maxPrice.amount !== minPrice.amount;

  const variantId = selectedVariantId;

  const productCode = (product.handle || '')
    .replace(/-/g, ' ')
    .toUpperCase()
    .slice(0, 12);

  const ratingValue = useMemo(() => {
    const anyProduct = product as any;
    const raw = anyProduct?.rating ?? anyProduct?.ratingValue;
    const parsed = typeof raw === 'string' ? Number.parseFloat(raw) : raw;
    return Number.isFinite(parsed) ? (parsed as number) : undefined;
  }, [product]);

  const hasColorVariants = useMemo(
    () => variants.some((v: any) => getColorValueFromVariant(v) != null),
    [variants],
  );

  const {visibleVariants, hiddenCount} = useMemo(() => {
    if (showAllVariants) {
      return {visibleVariants: variants, hiddenCount: 0};
    }

    const top = variants.slice(0, 3);
    const selected = variants.find((v: any) => v?.id === selectedVariantId);
    const selectedInTop = selected
      ? top.some((v: any) => v?.id === selected.id)
      : true;

    const merged = !selectedInTop && selected ? [...top.slice(0, 2), selected] : top;
    const hidden = Math.max(0, variants.length - 3);
    return {visibleVariants: merged, hiddenCount: hidden};
  }, [showAllVariants, variants, selectedVariantId]);

  const imageKey =
    (displayImage as any)?.url ??
    (displayImage as any)?.id ??
    (featuredImage as any)?.url ??
    selectedVariantId ??
    product.handle;

  return (
    <div className="group relative rounded-xl p-3.5 sm:p-4 border border-white/10 bg-white/5 shadow-luxury transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-luxury-lg">
      <Link
        to={variantUrl}
        prefetch="intent"
        aria-label={product.title ? `View ${product.title}` : 'View product'}
        className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        <div className="relative rounded-xl aspect-square mb-3 overflow-hidden bg-black/20 ring-1 ring-white/10 transition-colors duration-300 group-hover:ring-white/20">
          <div className="absolute left-2.5 top-2.5 z-[1] flex items-center gap-2">
            {ratingValue != null ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/15 backdrop-blur">
                <Star size={14} className="text-brand-neon" fill="currentColor" />
                {ratingValue.toFixed(1)}
              </span>
            ) : null}
            {hasDiscount && salePercent != null ? (
              <span className="inline-flex items-center rounded-full bg-brand-neon px-3 py-1 text-[11px] font-extrabold tracking-wide text-slate-950 shadow-glow-blue">
                {salePercent}% OFF
              </span>
            ) : null}
          </div>

          <div className="absolute left-2.5 top-11 z-[1] flex flex-col gap-2">
            {subtitle ? (
              <span className="inline-flex w-fit items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/20 backdrop-blur">
                {subtitle}
              </span>
            ) : null}
          </div>

          <div className="h-full w-full flex items-center justify-center">
            {displayImage ? (
              <Image
                key={String(imageKey)}
                data={displayImage}
                alt={
                  (displayImage as any)?.altText ||
                  featuredImage?.altText ||
                  product.title ||
                  'Product image'
                }
                loading={loading}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02] animate-fade-in"
                sizes="(min-width: 64em) 320px, (min-width: 48em) 33vw, 50vw"
              />
            ) : (
              <div aria-hidden className="h-full w-full rounded-xl bg-white/10" />
            )}
          </div>

          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {productCode ? (
              <p className="text-[11px] text-white/50 mb-1">{productCode}</p>
            ) : null}
            <h3 className="font-semibold text-[15px] sm:text-base text-white line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            {displayPrice ? (
              isPriceRange && !selectedVariantId ? (
                <span className="inline-flex items-baseline gap-2">
                  <span className="text-[11px] font-semibold text-white/60">
                    From
                  </span>
                  <span className="text-lg font-extrabold text-white tracking-tight">
                    <Money data={minPrice!} />
                  </span>
                </span>
              ) : (
                <span className="text-lg font-extrabold text-white tracking-tight">
                  <Money data={displayPrice} />
                </span>
              )
            ) : (
              <span className="text-sm font-semibold text-white/60">
                Price unavailable
              </span>
            )}

            {hasDiscount && displayCompareAt ? (
              <span className="text-xs text-white/45 line-through">
                <Money data={displayCompareAt} />
              </span>
            ) : null}
          </div>

          {hasDiscount ? (
            <div className="mt-1 text-xs text-white/60">
              Sale price • Compare at shown
            </div>
          ) : null}
        </div>
      </Link>

      {variants.length > 0 ? (
        <div className="mt-3">
          <div className="flex items-center gap-2 overflow-x-auto flex-wrap whitespace-nowrap pb-1">
            {visibleVariants.map((v: any) => {
              const active = v?.id === selectedVariantId;
              const colorValue = hasColorVariants
                ? getColorValueFromVariant(v)
                : undefined;
              const swatchColor = colorValue ? toSwatchColor(colorValue) : undefined;

              const label = !hasColorVariants
                ? String(v?.title ?? '')
                    .split('/')
                    .map((s) => s.trim())
                    .filter(Boolean)[0]
                    ?.slice(0, 14)
                : undefined;

              return (
                <button
                  key={String(v?.id)}
                  type="button"
                  onClick={() => setSelectedVariantId(v?.id)}
                  className={
                    hasColorVariants
                      ? active
                        ? 'h-6 w-6 rounded-none overflow-hidden ring-2 ring-brand-neon shadow-glow-blue'
                        : 'h-6 w-6 rounded-none overflow-hidden ring-1 ring-white/15 hover:ring-white/25'
                      : active
                        ? 'h-9 rounded-full bg-brand-neon text-slate-950 px-3 text-xs font-extrabold ring-1 ring-brand-neon shadow-glow-blue'
                        : 'h-9 rounded-full bg-white/5 text-white/75 px-3 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10'
                  }
                  aria-pressed={active}
                  aria-label={
                    hasColorVariants
                      ? `Select ${colorValue ?? 'color'} variant`
                      : `Select ${label ?? 'variant'}`
                  }
                  title={hasColorVariants ? colorValue : label}
                  style={
                    hasColorVariants
                      ? {
                          background:
                            swatchColor ??
                            'repeating-linear-gradient(45deg, rgba(255,255,255,0.18), rgba(255,255,255,0.18) 6px, rgba(255,255,255,0.06) 6px, rgba(255,255,255,0.06) 12px)',
                        }
                      : undefined
                  }
                >
                  {hasColorVariants ? (
                    <span className="sr-only">{colorValue ?? 'Color'}</span>
                  ) : (
                    label || 'Variant'
                  )}
                </button>
              );
            })}

            {hiddenCount > 0 ? (
              <button
                type="button"
                onClick={() => setShowAllVariants(true)}
                className={
                  hasColorVariants
                    ? 'h-6 min-w-6 rounded-none bg-black/20 text-white/80 px-1.5 text-[10px] font-extrabold ring-1 ring-white/15 hover:bg-white/10'
                    : 'h-9 rounded-full bg-black/20 text-white/75 px-3 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10'
                }
                aria-label={`View ${hiddenCount} more variants`}
              >
                {hasColorVariants ? `+${hiddenCount}` : `+${hiddenCount} more`}
              </button>
            ) : null}

            {showAllVariants && variants.length > 3 ? (
              <button
                type="button"
                onClick={() => setShowAllVariants(false)}
                className={
                  hasColorVariants
                    ? 'h-6 min-w-6 rounded-none bg-black/20 text-white/80 px-1.5 text-[10px] font-extrabold ring-1 ring-white/15 hover:bg-white/10'
                    : 'h-9 rounded-full bg-black/20 text-white/75 px-3 text-xs font-semibold ring-1 ring-white/10 hover:bg-white/10'
                }
                aria-label="Show fewer variants"
              >
                {hasColorVariants ? '–' : 'Less'}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="flex items-center gap-2">
          {variantId ? (
            <AddToCartButton
              lines={[{merchandiseId: variantId, quantity: 1}]}
              className="group flex-1 h-11 bg-brand-neon hover:bg-brand-neon-light text-slate-950 font-extrabold px-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-glow-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-[1px]"
              ariaLabel={product.title ? `Add ${product.title} to cart` : 'Add to cart'}
            >
              <span>Add</span>
              <span className="hidden sm:inline-flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ShoppingBag size={18} />
              </span>
            </AddToCartButton>
          ) : (
            <Link
              to={variantUrl}
              prefetch="intent"
              className="group flex-1 h-11 bg-brand-neon hover:bg-brand-neon-light text-slate-950 font-extrabold px-4 rounded-xl inline-flex items-center justify-center gap-2 shadow-glow-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:translate-y-[1px]"
              aria-label={product.title ? `View ${product.title}` : 'View product'}
            >
              <span>View</span>
              <span className="hidden sm:inline-flex opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <ShoppingBag size={18} />
              </span>
            </Link>
          )}

          <button
            type="button"
            disabled
            className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white/5 text-white/60 ring-1 ring-white/10 opacity-50 cursor-not-allowed"
            aria-label="Quick view (coming soon)"
            title="Quick view (coming soon)"
          >
            <Eye size={18} />
          </button>

          <button
            type="button"
            disabled
            className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white/5 text-white/60 ring-1 ring-white/10 opacity-50 cursor-not-allowed"
            aria-label="Wishlist (coming soon)"
            title="Wishlist (coming soon)"
          >
            <Heart size={18} />
          </button>

          <button
            type="button"
            disabled
            className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-white/5 text-white/60 ring-1 ring-white/10 opacity-50 cursor-not-allowed"
            aria-label="Compare (coming soon)"
            title="Compare (coming soon)"
          >
            <GitCompareArrows size={18} />
          </button>
        </div>
      </div>
    </div>
  );
});
