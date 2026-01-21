import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingBag} from 'lucide-react';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  if (layout === 'page') {
    return (
      <section className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-60">
          <div className="absolute inset-x-10 top-0 h-48 bg-gradient-to-b from-brand-neon/10 via-brand-neon/0 to-transparent blur-3xl" />
          <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-brand-neon/10 blur-3xl" />
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 px-4 py-4 shadow-lg shadow-black/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-neon/15 to-brand-neon/5 ring-1 ring-brand-neon/25 flex items-center justify-center">
              <ShoppingBag size={18} className="text-brand-neon" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs uppercase tracking-[0.16em] text-white/60">Step 1 of 3</p>
              <h1 className="text-base sm:text-3xl font-bold text-white">Review your cart</h1>
              <p className="text-sm text-white/70">
                Curate your haul, adjust quantities, and breeze through checkout.
              </p>
            </div>
          </div>
          {cartHasItems && (
            <span className="ml-auto text-xs font-semibold text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-full ring-1 ring-brand-neon/20">
              {cart?.totalQuantity} item{cart?.totalQuantity !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {!linesCount ? (
          <div className="rounded-2xl border border-white/10 bg-white/5">
            <CartEmpty hidden={false} layout={layout} />
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,400px)] items-start min-h-[calc(100vh-240px)] h-auto lg:h-[calc(100vh-260px)]">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/10 to-white/5 shadow-xl shadow-black/10 flex flex-col h-[calc(100vh-320px)] sm:h-[calc(100vh-340px)] lg:h-[calc(100vh-260px)] transition-all duration-300">
              <div className="pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-neon/40 to-transparent" />
                <div className="absolute -right-6 top-6 h-24 w-24 rounded-full bg-brand-neon/15 blur-2xl" />
              </div>
              <div className="relative p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 h-full overflow-hidden">
                <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-white/70">
                    <span className="h-2 w-2 rounded-full bg-brand-neon/80 shadow-[0_0_0_6px_rgba(59,130,246,0.15)] flex-shrink-0" />
                    <span className="truncate">Live updates as you edit</span>
                  </div>
                  <Link
                    to="/collections"
                    prefetch="viewport"
                    className="text-xs font-semibold text-brand-neon/80 hover:text-brand-neon transition-colors whitespace-nowrap"
                  >
                    Keep browsing →
                  </Link>
                </div>
                <div className="flex-1 cart-scroll overflow-y-auto pr-1 sm:pr-2 min-h-0">
                  <ul className="space-y-2 sm:space-y-3 pb-4 sm:pb-6" role="list">
                    {(cart?.lines?.nodes ?? []).map((line, idx) => (
                      <li key={line.id} className="animate-fadeIn" style={{animationDelay: `${idx * 50}ms`}}>
                        <CartLineItem line={line} layout={layout} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {cartHasItems && (
              <div className="lg:sticky lg:top-20 lg:right-0 w-full lg:w-auto animate-slideIn">
                <CartSummary cart={cart} layout={layout} />
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-black/40 via-black/20 to-black/40 backdrop-blur-2xl">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-neon/20 to-brand-neon/5 ring-1 ring-brand-neon/30 flex items-center justify-center">
            <ShoppingBag size={18} className="text-brand-neon" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white">Cart</h2>
          {cartHasItems && (
            <span className="ml-auto text-xs sm:text-sm font-semibold text-brand-neon bg-brand-neon/10 px-3 py-1 rounded-full ring-1 ring-brand-neon/20">
              {cart?.totalQuantity} item{cart?.totalQuantity !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 cart-scroll overflow-y-auto">
        {!linesCount ? (
          <CartEmpty hidden={false} layout={layout} />
        ) : (
          <div className="p-4 sm:p-6">
            <ul className="space-y-2 sm:space-y-3" role="list">
              {(cart?.lines?.nodes ?? []).map((line, idx) => (
                <li key={line.id} className="animate-fadeIn" style={{animationDelay: `${idx * 50}ms`}}>
                  <CartLineItem line={line} layout={layout} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Summary & Checkout - Sticky */}
      {cartHasItems && <CartSummary cart={cart} layout={layout} />}
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div
      hidden={hidden}
      className="flex flex-col items-center justify-center h-full px-6 py-12 text-center"
    >
      <div className="mb-6 h-16 w-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/20 flex items-center justify-center">
        <ShoppingBag size={32} className="text-white/40" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Cart is empty
      </h3>
      <p className="text-sm text-white/60 mb-6">
        Looks like you haven&rsquo;t added anything yet. Let&rsquo;s get you
        started!
      </p>
      <Link
        to="/collections"
        onClick={close}
        prefetch="viewport"
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-neon to-brand-neon-light text-slate-950 font-semibold rounded-xl hover:brightness-110 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
