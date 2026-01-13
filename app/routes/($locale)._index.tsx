import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {HeroSlideshow} from '~/components/HeroSlideshow';
import {TestimonialCard} from '~/components/TestimonialCard';
import {InstagramFeed} from '~/components/InstagramFeed';
import {NewsletterSignup} from '~/components/NewsletterSignup';
import {BrandStory} from '~/components/BrandStory';
import {TrustBar} from '~/components/TrustBar';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Premium Gadgets Store | Graphite Luxury + Neon Tech'},
    {
      name: 'description',
      content:
        'Shop premium gadgets with a clean, modern experience. Best sellers, new arrivals, fast shipping, easy returns, and warranty included.',
    },
  ];
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
  const [{collections}, {collections: allCollections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(ALL_COLLECTIONS_QUERY),
  ]);

  return {
    featuredCollection: collections.nodes[0],
    allCollections: allCollections.nodes,
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
      console.error(error);
      return null;
    });

  const bestSellingProducts = context.storefront
    .query(BEST_SELLING_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const newArrivals = context.storefront
    .query(NEW_ARRIVALS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
    bestSellingProducts,
    newArrivals,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <HeroSlideshow />
      <TrustSection />
      <BestSellers products={data.bestSellingProducts} />
      <NewArrivals products={data.newArrivals} />
      <ShopByCategory collections={data.allCollections} />
      <FeaturedCollectionBanner collection={data.featuredCollection} />
      <BrandStory />
      <CollectionSpotlight collections={data.allCollections} />
      <CustomerTestimonials />
      <InstagramFeed />
      <WhyChooseUs />
      <NewsletterSignup />
    </div>
  );
}

function TrustSection() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-[1200px] mx-auto">
        <TrustBar />
      </div>
    </section>
  );
}

function ShopByCategory({collections}: {collections: any[]}) {
  const displayCollections = collections.slice(0, 8);

  return (
    <section className="shop-by-category">
      <div className="section-header">
        <h2>Shop By Category</h2>
        <p>Find the perfect gadget for every moment</p>
      </div>
      <div className="categories-grid">
        {displayCollections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="category-card"
          >
            {collection.image && (
              <div className="category-card-image">
                <Image data={collection.image} sizes="(min-width: 768px) 25vw, 50vw" />
              </div>
            )}
            <div className="category-card-content">
              <h3>{collection.title}</h3>
              <span className="category-link">Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FeaturedCollectionBanner({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <section className="featured-collection-banner">
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

function BestSellers({products}: {products: Promise<any>}) {
  return (
    <section className="best-sellers-section">
      <div className="section-header">
        <h2>Best Sellers</h2>
        <p>Our most-loved tech this season</p>
      </div>
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="best-sellers-grid">
              {response
                ? response.products.nodes.map((product: any) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <div className="section-cta">
        <Link to="/collections/all" className="btn btn-outline">
          View All Bestsellers
        </Link>
      </div>
    </section>
  );
}

function NewArrivals({products}: {products: Promise<any>}) {
  return (
    <section className="new-arrivals-section">
      <div className="section-header">
        <h2>New Arrivals</h2>
        <p>Fresh drops, modern essentials</p>
      </div>
      <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="new-arrivals-scroll">
              {response
                ? response.products.nodes.map((product: any) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

function CollectionSpotlight({collections}: {collections: any[]}) {
  const spotlightCollections = collections.slice(0, 3);

  return (
    <section className="collection-spotlight">
      <div className="section-header">
        <h2>Featured Collections</h2>
        <p>Curated selections for every style</p>
      </div>
      <div className="spotlight-grid">
        {spotlightCollections.map((collection) => (
          <Link
            key={collection.id}
            to={`/collections/${collection.handle}`}
            className="spotlight-card"
          >
            {collection.image && (
              <div className="spotlight-image">
                <Image data={collection.image} sizes="(min-width: 768px) 33vw, 100vw" />
              </div>
            )}
            <div className="spotlight-content">
              <h3>{collection.title}</h3>
              <span className="spotlight-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function CustomerTestimonials() {
  const testimonials = [
    {
      name: 'Sarah Ahmed',
      rating: 5,
      review:
        'Absolutely love my AODOUR handbag! The quality is exceptional and it goes with everything in my wardrobe. Best purchase this year!',
      location: 'Karachi, Pakistan',
      image: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/testimonial-1.jpg',
    },
    {
      name: 'Ali Hassan',
      rating: 5,
      review:
        'The leather briefcase is exactly what I needed for work. Professional, durable, and stylish. Highly recommend AODOUR!',
      location: 'Lahore, Pakistan',
      image: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/testimonial-2.jpg',
    },
    {
      name: 'Ayesha Khan',
      rating: 5,
      review:
        'Amazing customer service and beautiful products. The travel bag I bought has been my constant companion on all my trips.',
      location: 'Islamabad, Pakistan',
      image: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/files/testimonial-3.jpg',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="section-header">
        <h2>What Our Customers Say</h2>
        <p>Real reviews from real customers</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const reasons = [
    {
      icon: '⚡',
      title: 'Latest Tech',
      description: 'Curated gadgets built for daily performance',
    },
    {
      icon: '✨',
      title: 'Premium Build',
      description: 'High-quality materials and reliable engineering',
    },
    {
      icon: '🌱',
      title: 'Responsible Choices',
      description: 'Thoughtful options that last longer',
    },
    {
      icon: '💎',
      title: 'Detail Focused',
      description: 'Specs and features that matter, clearly explained',
    },
    {
      icon: '🛡️',
      title: 'Warranty Included',
      description: 'Confidence with every purchase',
    },
    {
      icon: '🚚',
      title: 'Fast Shipping',
      description: 'Tracked delivery and smooth checkout',
    },
  ];

  return (
    <section className="why-choose-section">
      <div className="section-header">
        <h2>Why Choose Us</h2>
        <p>Premium tech, fast delivery, and peace of mind</p>
      </div>
      <div className="why-choose-grid">
        {reasons.map((reason, index) => (
          <div key={index} className="why-choose-card">
            <div className="why-choose-icon">{reason.icon}</div>
            <h3>{reason.title}</h3>
            <p>{reason.description}</p>
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

const ALL_COLLECTIONS_QUERY = `#graphql
  fragment CollectionItem on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query AllCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 8, sortKey: TITLE) {
      nodes {
        ...CollectionItem
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
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
    selectedOrFirstAvailableVariant {
      id
      title
      availableForSale
      selectedOptions {
        name
        value
      }
      image {
        id
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
    variants(first: 12) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
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

const BEST_SELLING_PRODUCTS_QUERY = `#graphql
  fragment BestSellingProduct on Product {
    id
    title
    handle
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
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
    selectedOrFirstAvailableVariant {
      id
      title
      availableForSale
      selectedOptions {
        name
        value
      }
      image {
        id
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
    variants(first: 12) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  query BestSellingProducts($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: BEST_SELLING) {
      nodes {
        ...BestSellingProduct
      }
    }
  }
` as const;

const NEW_ARRIVALS_QUERY = `#graphql
  fragment NewArrival on Product {
    id
    title
    handle
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
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
    selectedOrFirstAvailableVariant {
      id
      title
      availableForSale
      selectedOptions {
        name
        value
      }
      image {
        id
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
    }
    variants(first: 12) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }
  query NewArrivals($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...NewArrival
      }
    }
  }
` as const;
