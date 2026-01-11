import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="footer-content">
              <div className="footer-grid">
                {/* Brand Section */}
                <div className="footer-section footer-brand">
                  <div className="footer-brand-name">AODOUR</div>
                  <div className="footer-brand-tagline">LUXURY BAGS</div>
                  <p className="footer-description">
                    Premium quality bags crafted with attention to detail. 
                    Discover elegance and functionality in every piece.
                  </p>
                  <div className="footer-social">
                    <a href="https://facebook.com/aodour.pk" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                      <span>f</span>
                    </a>
                    <a href="https://instagram.com/aodour.pk" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                      <span>📷</span>
                    </a>
                    <a href="https://twitter.com/aodour_pk" className="footer-social-link" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <span>🐦</span>
                    </a>
                  </div>
                </div>

                {/* Shop Section */}
                <div className="footer-section">
                  <h3>Shop</h3>
                  <div className="footer-links">
                    <NavLink to="/collections/womens-bags" className="footer-link">Women's Bags</NavLink>
                    <NavLink to="/collections/mens-bags" className="footer-link">Men's Bags</NavLink>
                    <NavLink to="/collections/travel-bags" className="footer-link">Travel Bags</NavLink>
                    <NavLink to="/collections/accessories" className="footer-link">Accessories</NavLink>
                    <NavLink to="/collections/sale" className="footer-link">Sale</NavLink>
                  </div>
                </div>

                {/* Customer Care */}
                <div className="footer-section">
                  <h3>Customer Care</h3>
                  <div className="footer-links">
                    <NavLink to="/pages/contact" className="footer-link">Contact Us</NavLink>
                    <NavLink to="/pages/shipping" className="footer-link">Shipping Info</NavLink>
                    <NavLink to="/pages/returns" className="footer-link">Returns</NavLink>
                    <NavLink to="/pages/size-guide" className="footer-link">Size Guide</NavLink>
                    <NavLink to="/pages/faq" className="footer-link">FAQ</NavLink>
                  </div>
                </div>

                {/* About */}
                <div className="footer-section">
                  <h3>About</h3>
                  <div className="footer-links">
                    <NavLink to="/pages/about" className="footer-link">Our Story</NavLink>
                    <NavLink to="/pages/quality" className="footer-link">Quality Promise</NavLink>
                    <NavLink to="/blogs/journal" className="footer-link">Blog</NavLink>
                    <NavLink to="/pages/careers" className="footer-link">Careers</NavLink>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="footer-bottom">
                <div className="footer-bottom-content">
                  <div className="footer-copyright">
                    © {new Date().getFullYear()} AODOUR.PK. All rights reserved.
                  </div>
                  <div className="footer-trust-badges">
                    <span className="footer-trust-badge">🔒 Secure</span>
                    <span className="footer-trust-badge">✓ Authentic</span>
                    <span className="footer-trust-badge">🚚 Free Shipping</span>
                  </div>
                  <div className="footer-payment-icons">
                    <span className="footer-payment-icon">VISA</span>
                    <span className="footer-payment-icon">MC</span>
                    <span className="footer-payment-icon">COD</span>
                  </div>
                </div>
              </div>

              {/* Policy Menu */}
              {footer?.menu && header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              )}
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
