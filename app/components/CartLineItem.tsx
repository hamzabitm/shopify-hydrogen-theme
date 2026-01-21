import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {X, Plus, Minus, Loader2} from 'lucide-react';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const isUpdating = Boolean(line.isOptimistic);

  return (
    <li
      key={id}
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 hover:border-brand-neon/30 transition-all duration-300 p-3 hover:bg-gradient-to-br hover:from-white/15 hover:via-white/10 hover:to-white/15 shadow-lg shadow-black/10"
    >
      {isUpdating && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-black/30 backdrop-blur-sm text-xs text-white/80">
          <Loader2 size={16} className="animate-spin text-brand-neon" />
          Updating...
        </div>
      )}
      <div className="flex gap-3">
        {/* Product Image */}
        {image && (
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60"
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-white/20 hover:ring-brand-neon/50 transition-all duration-200">
              <Image
                alt={title}
                aspectRatio="1/1"
                data={image}
                height={80}
                loading="lazy"
                width={80}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        )}

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => {
              if (layout === 'aside') {
                close();
              }
            }}
            className="group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 rounded"
          >
            <h3 className="font-semibold text-sm text-white group-hover/link:text-brand-neon transition-colors truncate">
              {product.title}
            </h3>
          </Link>

          {/* Variant Options */}
          {selectedOptions.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {selectedOptions.map((option) => (
                <span
                  key={option.name}
                  className="text-xs text-white/60 bg-white/5 px-2 py-0.5 rounded"
                >
                  {option.name}: {option.value}
                </span>
              ))}
            </div>
          )}

          {/* Price & Quantity Controls */}
          <div className="mt-2 flex items-center justify-between">
            <ProductPrice price={line?.cost?.totalAmount} />
            <CartLineQuantity line={line} />
          </div>
        </div>

        {/* Remove Button */}
        <div className="flex-shrink-0">
          <CartLineRemoveButton lineIds={[id]} disabled={!!line.isOptimistic} />
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-1 bg-white/5 ring-1 ring-white/15 rounded-lg p-1">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
          className="p-1 text-white/70 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={14} />
        </button>
      </CartLineUpdateButton>
      <span
        className="w-8 text-center text-xs font-semibold text-white"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
          className="p-1 text-white/70 hover:text-white disabled:text-white/30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={14} />
        </button>
      </CartLineUpdateButton>
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="p-1.5 text-white/60 hover:text-red-400 disabled:text-white/20 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-red-500/10"
        aria-label="Remove item"
      >
        <X size={16} />
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}
