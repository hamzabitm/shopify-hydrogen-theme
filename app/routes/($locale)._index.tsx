import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: Route.MetaFunction = () => {
  return [{title: 'AODOUR - Premium Luxury Bags | Shop Women\'s & Men\'s Bags'}, {name: 'description', content: 'Discover premium quality bags at AODOUR.PK. Shop luxury handbags, backpacks, travel bags, and accessories crafted with attention to detail.'}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedCollection collection={data.featuredCollection} />
      <RecommendedProducts products={data.recommendedProducts} />
      <TrustSection />
    </div>
  );
}

function HeroSection() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Elegance Meets Functionality</h1>
        <p className="hero-subtitle">
          Discover premium quality bags crafted for the modern lifestyle
        </p>
        <div className="hero-cta">
          <Link to="/collections/all" className="btn btn-primary">
            Shop Now
          </Link>
          <Link to="/collections/new-arrivals" className="btn btn-secondary">
            New Arrivals
          </Link>
        </div>
      </div>
      <div className="hero-image">
        <div className="hero-image-placeholder">
          {/* Hero image would go here */}
        </div>
      </div>
    </div>
  );
}

function FeaturedCategories() {
  const categories = [
    {
      title: "Women's Bags",
      handle: 'womens-bags',
      description: 'Elegant handbags & totes',
      icon: '👜',
    },
    {
      title: "Men's Bags",
      handle: 'mens-bags',
      description: 'Professional briefcases',
      icon: '💼',
    },
    {
      title: 'Travel Bags',
      handle: 'travel-bags',
      description: 'Durable luggage & duffels',
      icon: '🧳',
    },
    {
      title: 'Accessories',
      handle: 'accessories',
      description: 'Wallets & small leather goods',
      icon: '👛',
    },
  ];

  return (
    <section className="featured-categories">
      <div className="section-header">
        <h2>Shop By Category</h2>
        <p>Find the perfect bag for every occasion</p>
      </div>
      <div className="categories-grid">
        {categories.map((category) => (
          <Link
            key={category.handle}
            to={`/collections/${category.handle}`}
            className="category-card"
          >
            <div className="category-icon">{category.icon}</div>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <span className="category-link">Shop Now →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="featured-collection-section">
      <Link
        className="featured-collection"
        to={`/collections/${collection.handle}`}
      >
        {image && (
          <div className="featured-collection-image">
            <Image data={image} sizes="100vw" />
          </div>
        )}
        <div className="featured-collection-overlay">
          <h2>{collection.title}</h2>
          <span className="btn btn-light">Explore Collection</span>
        </div>
      </Link>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="recommended-products">
      <div className="section-header">
        <h2>Bestsellers</h2>
        <p>Our most loved bags</p>
      </div>
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <div className="section-cta">
        <Link to="/collections/all" className="btn btn-outline">
          View All Products
        </Link>
      </div>
    </section>
  );
}

function TrustSection() {
  const features = [
    {
      icon: '✓',
      title: 'Authentic Products',
      description: '100% genuine bags',
    },
    {
      icon: '🚚',
      title: 'Free Shipping',
      description: 'On orders over Rs. 5000',
    },
    {
      icon: '↻',
      title: 'Easy Returns',
      description: '30-day return policy',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Safe & encrypted checkout',
    },
  ];

  return (
    <section className="trust-section">
      <div className="trust-grid">
        {features.map((feature, index) => (
          <div key={index} className="trust-item">
            <div className="trust-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
