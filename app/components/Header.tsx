import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ThemeToggle} from '~/components/ThemeToggle';
import {Menu, X, Search, ShoppingBag} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

function normalizeMenuUrl(
  url: string,
  {
    primaryDomainUrl,
    publicStoreDomain,
  }: {primaryDomainUrl: string; publicStoreDomain: string},
) {
  return url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl)
    ? new URL(url).pathname
    : url;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-xl shadow-luxury transition-all duration-300">
      {/* Premium gradient border glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-neon/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <NavLink prefetch="intent" to="/" className="group/logo no-underline">
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
              {/* Logo Image */}
              <img 
                src="https://cdn.shopify.com/s/files/1/0732/3182/7102/files/Genze_Logo.png?v=1760642974" 
                alt="Genze Logo" 
                className="h-9 w-44 object-contain group-hover/logo:brightness-110 transition-all duration-200"
              />
             
            </div>
            
            {/* SEO Structured Data */}
            <script type="application/ld+json">
              {JSON.stringify({
                '@context': 'https://schema.org/',
                '@type': 'Organization',
                name: 'Genze',
                url: shop?.primaryDomain?.url,
                description: 'Premium Fashion and Luxury Goods',
                logo: 'https://genze.pk/cdn/shop/files/Genze_Logo_fcb874a5-e967-4bcd-8c0f-8033977b09b8.svg?v=1760551111&width=130',
              })}
            </script>
          </NavLink>

          {/* Desktop Mega Menu */}
          <div className="hidden lg:block">
            <MegaMenu
              menu={menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
              viewport="desktop"
            />
          </div>

          {/* Header CTAs */}
          <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
        </div>
      </div>
    </header>
  );
}

/* Mega Menu Component */
export function MegaMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  viewport,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
  viewport: Viewport;
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const {close} = useAside();

  const menuItems = (menu || FALLBACK_HEADER_MENU).items;

  if (viewport === 'mobile') {
    return (
      <nav className="flex flex-col gap-2" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className="px-4 py-2 text-base font-semibold text-white hover:text-brand-neon transition-colors"
        >
          Home
        </NavLink>
        {menuItems.map((item) => {
          if (!item.url) return null;

          const url = normalizeMenuUrl(item.url, {
            primaryDomainUrl,
            publicStoreDomain,
          });

          const children = (item.items ?? []).filter(Boolean);
          const hasSubmenu = children.length > 0;

          if (!hasSubmenu) {
            return (
              <div key={item.id}>
                <NavLink
                  className="block px-4 py-2 text-base font-semibold text-white hover:text-brand-neon transition-colors"
                  end
                  onClick={close}
                  prefetch="intent"
                  to={url}
                >
                  {item.title}
                </NavLink>
              </div>
            );
          }

          return (
            <details key={item.id} className="group">
              <summary className="flex items-center justify-between px-4 py-2 cursor-pointer font-semibold text-white text-base hover:text-brand-neon transition-colors">
                <span>{item.title}</span>
                <span className="transition-transform group-open:rotate-180">▾</span>
              </summary>
              <div className="flex flex-col gap-1 pl-4 py-1">
                <NavLink
                  className="px-4 py-2 text-base font-semibold text-brand-neon hover:text-brand-neon-light transition-colors"
                  end
                  onClick={close}
                  prefetch="intent"
                  to={url}
                >
                  Shop all
                </NavLink>

                <div className="flex flex-col gap-1">
                  {children.map((subitem) => {
                    if (!subitem.url) return null;
                    const subUrl = normalizeMenuUrl(subitem.url, {
                      primaryDomainUrl,
                      publicStoreDomain,
                    });

                    return (
                      <NavLink
                        key={subitem.id}
                        className="px-4 py-2 text-base text-white/70 hover:text-white hover:translate-x-1 transition-all"
                        end
                        onClick={close}
                        prefetch="intent"
                        to={subUrl}
                      >
                        {subitem.title}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            </details>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1" role="navigation">
      {menuItems.map((item) => {
        if (!item.url) return null;

        const url = normalizeMenuUrl(item.url, {
          primaryDomainUrl,
          publicStoreDomain,
        });

        const children = (item.items ?? []).filter(Boolean);
        const hasSubmenu = children.length > 0;
        const isActive = activeMenu === item.id;

        const featuredLinks = children.slice(0, 6);
        const moreLinks = children.slice(6, 12);

        const panelId = `mega-${String(item.id).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

        return (
          <div
            key={item.id}
            className="relative group"
            onMouseEnter={() => hasSubmenu && setActiveMenu(item.id)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <NavLink
              className="px-4 py-2 text-[15px] sm:text-base font-semibold text-white/90 hover:text-brand-neon transition-all duration-200 relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              end
              prefetch="intent"
              to={url}
              aria-haspopup={hasSubmenu ? 'true' : undefined}
              aria-expanded={hasSubmenu ? isActive : undefined}
              aria-controls={hasSubmenu ? panelId : undefined}
            >
              <span>{item.title}</span>
              {hasSubmenu && (
                <span className="ml-1.5 inline-block text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              )}
              
              {/* Underline glow effect */}
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-brand-neon to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>

            {/* Premium Mega Menu Dropdown */}
            {hasSubmenu && (
              <div 
                className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                id={panelId}
              >
                <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/5 backdrop-blur-2xl shadow-2xl overflow-hidden">
                  {/* Premium gradient border */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-neon/50 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-20 pointer-events-none bg-gradient-to-b from-white/5 to-transparent" />
                  
                  <div className="grid grid-cols-3 gap-6 p-6 min-w-[800px]">
                    {/* Featured Links */}
                    <div className="flex flex-col gap-1">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-brand-neon mb-3">
                        Featured
                      </h4>
                      <ul className="flex flex-col gap-0.5">
                        {featuredLinks.map((subitem) => {
                          if (!subitem.url) return null;
                          const subUrl = normalizeMenuUrl(subitem.url, {
                            primaryDomainUrl,
                            publicStoreDomain,
                          });

                          return (
                            <li key={subitem.id}>
                              <NavLink
                                to={subUrl}
                                prefetch="intent"
                                className="px-2 py-1.5 text-[15px] text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-150 block"
                              >
                                {subitem.title}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* More Links */}
                    {moreLinks.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <h4 className="text-xs uppercase font-bold tracking-wider text-white/60 mb-3">
                          More
                        </h4>
                        <ul className="flex flex-col gap-0.5">
                          {moreLinks.map((subitem) => {
                            if (!subitem.url) return null;
                            const subUrl = normalizeMenuUrl(subitem.url, {
                              primaryDomainUrl,
                              publicStoreDomain,
                            });

                            return (
                              <li key={subitem.id}>
                                <NavLink
                                  to={subUrl}
                                  prefetch="intent"
                                  className="px-2 py-1.5 text-[15px] text-white/70 hover:text-white hover:bg-white/10 rounded transition-all duration-150 block"
                                >
                                  {subitem.title}
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}

                    {/* Premium Featured Banner */}
                    <div className="relative overflow-hidden rounded-xl border border-brand-neon/30 bg-gradient-to-br from-brand-neon/20 via-brand-neon/5 to-transparent p-4 flex flex-col justify-between">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,rgba(0,217,255,0.5),transparent)]" />
                      <div className="relative z-10">
                        <h3 className="font-bold text-white mb-2">{item.title}</h3>
                        <p className="text-xs text-white/70 mb-4">
                          Premium collection
                        </p>
                        <NavLink
                          to={url}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-neon text-slate-950 rounded-lg font-semibold text-xs hover:bg-brand-neon-light transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60"
                        >
                          Shop all
                          <span>→</span>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}


const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/1',
      resourceId: null,
      tags: [],
      title: "Women's Bags",
      type: 'HTTP',
      url: '/collections/womens-bags',
      items: [
        { id: '1a', title: 'Handbags', url: '/collections/womens-bags?type=handbags' },
        { id: '1b', title: 'Crossbody', url: '/collections/womens-bags?type=crossbody' },
        { id: '1c', title: 'Clutches', url: '/collections/womens-bags?type=clutches' },
        { id: '1d', title: 'Totes', url: '/collections/womens-bags?type=totes' },
      ],
    },
    {
      id: 'gid://shopify/MenuItem/2',
      resourceId: null,
      tags: [],
      title: "Men's Bags",
      type: 'HTTP',
      url: '/collections/mens-bags',
      items: [
        { id: '2a', title: 'Backpacks', url: '/collections/mens-bags?type=backpacks' },
        { id: '2b', title: 'Briefcases', url: '/collections/mens-bags?type=briefcases' },
        { id: '2c', title: 'Shoulder Bags', url: '/collections/mens-bags?type=shoulder' },
      ],
    },
    {
      id: 'gid://shopify/MenuItem/3',
      resourceId: null,
      tags: [],
      title: 'Travel Bags',
      type: 'HTTP',
      url: '/collections/travel-bags',
      items: [
        { id: '3a', title: 'Luggage', url: '/collections/travel-bags?type=luggage' },
        { id: '3b', title: 'Weekenders', url: '/collections/travel-bags?type=weekenders' },
        { id: '3c', title: 'Carry-ons', url: '/collections/travel-bags?type=carryons' },
      ],
    },
    {
      id: 'gid://shopify/MenuItem/4',
      resourceId: null,
      tags: [],
      title: 'Accessories',
      type: 'HTTP',
      url: '/collections/accessories',
      items: [
        { id: '4a', title: 'Belts', url: '/collections/accessories?type=belts' },
        { id: '4b', title: 'Scarves', url: '/collections/accessories?type=scarves' },
        { id: '4c', title: 'Wallets', url: '/collections/accessories?type=wallets' },
      ],
    },
    {
      id: 'gid://shopify/MenuItem/5',
      resourceId: null,
      tags: [],
      title: 'Sale',
      type: 'HTTP',
      url: '/collections/sale',
      items: [],
    },
  ],
};

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="flex items-center gap-1" role="navigation">
      <SearchToggle />
      <NavLink 
        prefetch="intent" 
        to="/account" 
        className="hidden sm:flex h-10 px-3 rounded-lg items-center text-[15px] font-semibold text-white/90 hover:text-brand-neon hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60"
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <CartToggle cart={cart} />
      <ThemeToggle />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="lg:hidden h-10 w-10 rounded-lg flex items-center justify-center text-white/90 hover:text-brand-neon hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60"
      onClick={() => open('mobile')}
      aria-label="Open mobile menu"
      title="Menu"
    >
      <Menu size={20} />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="h-10 w-10 rounded-lg flex items-center justify-center text-white/90 hover:text-brand-neon hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60" 
      onClick={() => open('search')}
      aria-label="Search"
      title="Search"
    >
      <Search size={20} />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="relative h-10 w-10 rounded-lg flex items-center justify-center text-white/90 hover:text-brand-neon hover:bg-white/10 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon/60"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Cart with ${count} items`}
    >
      <ShoppingBag size={20} />
      {count !== null && count > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-brand-neon to-brand-neon-light flex items-center justify-center text-xs font-bold text-slate-950 shadow-glow-blue">
          {count}
        </span>
      )}
    </button>
  );
}


function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}


function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
