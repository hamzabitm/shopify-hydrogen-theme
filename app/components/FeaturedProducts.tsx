import {Link} from 'react-router';
import {ProductCard} from './ProductCard';
import type {Product} from '@shopify/hydrogen/storefront-api-types';

interface FeaturedProductsProps {
  products: Partial<Product>[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  collectionLink?: string;
}

export function FeaturedProducts({
  products,
  title = 'Featured Collection',
  subtitle = 'Handpicked premium gadgets for tech enthusiasts',
  showViewAll = true,
  collectionLink = '/collections/all',
}: FeaturedProductsProps) {
  return (
    <section className="relative py-20 md:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-block mb-4 px-4 py-2 rounded-full border border-sky-200 bg-white/70 text-sky-700 text-sm font-semibold tracking-wider uppercase backdrop-blur">
            Curated Selection
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              imageHeight="h-80"
            />
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center">
            <Link
              to={collectionLink}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-sky-600 text-sky-700 rounded-lg font-semibold hover:bg-sky-600 hover:text-white transition-all duration-300 group"
            >
              View All Products
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
