import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import type {FetcherWithComponents} from 'react-router';
import {Tag, Ticket, ShieldCheck, Truck, RefreshCcw} from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 120;

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const containerClass =
    layout === 'aside'
      ? 'border-t border-white/10 px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-transparent via-white/5 to-white/10'
      : 'rounded-2xl border border-white/10 px-4 sm:px-6 py-5 sm:py-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-white/5 via-white/10 to-white/5 shadow-xl shadow-black/10 transition-all duration-300';

  return (
    <div
      aria-labelledby="cart-summary"
      className={containerClass}
    >
      <FreeShippingProgress subtotal={cart?.cost?.subtotalAmount} />

      {/* Subtotal */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-white/70">Subtotal</span>
          <span className="font-semibold text-white">
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>

        {/* Discount Section */}
        <CartDiscounts discountCodes={cart?.discountCodes} />

        {/* Gift Card Section */}
        <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2 sm:my-3" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-sm sm:text-base">Total</span>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-neon to-brand-neon-light bg-clip-text text-transparent">
            {cart?.cost?.totalAmount?.amount ? (
              <Money data={cart?.cost?.totalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />

      <CartTrustSignals layout={layout} />
    </div>
  );
}

function FreeShippingProgress({
  subtotal,
}: {
  subtotal?: CartApiQueryFragment['cost']['subtotalAmount'];
}) {
  const amount = subtotal?.amount ? parseFloat(subtotal.amount) : 0;
  const currencyCode = subtotal?.currencyCode || 'USD';
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - amount);
  const progress = Math.min(100, Math.round((amount / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="p-2 sm:p-3 rounded-xl bg-white/5 ring-1 ring-white/10 space-y-2">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>Free shipping progress</span>
        <span className="font-semibold text-white">{progress}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-brand-neon to-brand-neon-light transition-[width] duration-500"
          style={{width: `${progress}%`}}
        />
      </div>
      <p className="text-xs text-white/80">
        {remaining <= 0 ? (
          <span className="text-brand-neon font-semibold">✓ You unlocked free shipping!</span>
        ) : (
          <>
            Add{' '}
            <Money
              data={{
                amount: remaining.toFixed(2),
                currencyCode,
              }}
            />{' '}
            more to ship free.
          </>
        )}
      </p>
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-brand-neon to-brand-neon-light text-slate-950 font-bold rounded-xl hover:brightness-110 active:brightness-95 transition-all duration-200 text-center text-xs sm:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 shadow-lg shadow-brand-neon/20"
    >
      Continue to Checkout →
    </a>
  );
}

function CartTrustSignals({layout}: {layout: CartLayout}) {
  const baseClass = 'flex items-start sm:items-center gap-2 px-2 sm:px-3 py-2 rounded-lg ring-1 ring-white/10 bg-white/5 text-xs text-white/80 transition-all duration-300 hover:ring-white/20 hover:bg-white/8';

  return (
    <div
      className={
        layout === 'aside'
          ? 'space-y-2'
          : 'grid grid-cols-1 sm:grid-cols-3 gap-2'
      }
    >
      <div className={baseClass}>
        <ShieldCheck size={14} className="text-brand-neon flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-tight">
          <div className="font-semibold text-white text-xs">Secure</div>
          <p className="text-xs text-white/70 hidden sm:block">Encrypted payments</p>
        </div>
      </div>
      <div className={baseClass}>
        <Truck size={14} className="text-brand-neon flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-tight">
          <div className="font-semibold text-white text-xs">Fast dispatch</div>
          <p className="text-xs text-white/70 hidden sm:block">Tracked shipping</p>
        </div>
      </div>
      <div className={baseClass}>
        <RefreshCcw size={14} className="text-brand-neon flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="leading-tight">
          <div className="font-semibold text-white text-xs">Easy returns</div>
          <p className="text-xs text-white/70 hidden sm:block">30-day exchanges</p>
        </div>
      </div>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="space-y-2">
      {/* Applied Discounts */}
      {codes.length > 0 && (
        <UpdateDiscountForm>
          <div className="flex items-center justify-between px-3 py-2 bg-green-500/10 ring-1 ring-green-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-green-400" />
              <code className="text-xs font-semibold text-green-300">
                {codes?.join(', ')}
              </code>
            </div>
            <button
              type="submit"
              className="text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              Remove
            </button>
          </div>
        </UpdateDiscountForm>
      )}

      {/* Discount Code Input */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <input
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="flex-1 px-3 py-2 bg-white/5 ring-1 ring-white/10 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-brand-neon/50"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-white/10 hover:bg-white/15 ring-1 ring-white/20 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-all"
          >
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const appliedGiftCardCodes = useRef<string[]>([]);
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  // Clear the gift card code input after the gift card is added
  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  function saveAppliedCode(code: string) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
  }

  return (
    <div className="space-y-2">
      {/* Display applied gift cards */}
      {giftCardCodes && giftCardCodes.length > 0 && (
        <div className="space-y-2">
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center justify-between px-3 py-2 bg-blue-500/10 ring-1 ring-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Ticket size={14} className="text-blue-400" />
                  <div className="flex flex-col">
                    <code className="text-xs font-semibold text-blue-300">
                      ***{giftCard.lastCharacters}
                    </code>
                    <span className="text-xs text-blue-300/70">
                      <Money data={giftCard.amountUsed} />
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </RemoveGiftCardForm>
          ))}
        </div>
      )}

      {/* Gift card code input */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
        fetcherKey="gift-card-add"
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="flex-1 px-3 py-2 bg-white/5 ring-1 ring-white/10 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:ring-brand-neon/50"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="px-3 py-2 bg-white/10 hover:bg-white/15 ring-1 ring-white/20 rounded-lg text-xs font-semibold text-white/80 hover:text-white disabled:opacity-50 transition-all"
          >
            Apply
          </button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  saveAppliedCode,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  saveAppliedCode?: (code: string) => void;
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code as string);
        }
        return children;
      }}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
