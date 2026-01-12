import {useLoaderData} from 'react-router';
import type {Route} from './+types/featured-products';
import {CustomProductsSection} from '~/components/CustomProductsSection';
import type {ProductItemFragment} from 'storefrontapi.generated';

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  // Fetch products from a specific collection
  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {
      handle: 'featured', // Change this to your collection handle
      first: 12,
    },
  });

  return {
    collection,
  };
}

export default function FeaturedProducts() {
  const {collection} = useLoaderData<typeof loader>();

  if (!collection || !collection.products) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <div>
      <CustomProductsSection
        heading={collection.title}
        subheading="Discover our latest collection"
        products={collection.products.nodes}
        collectionUrl={`/collections/${collection.handle}`}
        viewAllText="View all"
        productsPerRow={4}
        showViewAll={true}
        paddingTop={40}
        paddingBottom={40}
      />
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $first: Int!
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) {
        nodes {
          id
          handle
          title
          description
          featuredImage {
            id
            altText
            url
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          productType
          tags
          options {
            id
            name
            values
          }
          availableForSale
        }
      }
    }
  }
` as const;
