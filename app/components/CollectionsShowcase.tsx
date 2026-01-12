import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {Collection} from '@shopify/hydrogen/storefront-api-types';

interface CollectionsShowcaseProps {
  collections: Partial<Collection>[];
  title?: string;
  subtitle?: string;
}

export function CollectionsShowcase({
  collections,
  title = 'Shop by Category',
  subtitle = 'Explore our premium gadget collections',
}: CollectionsShowcaseProps) {
  return (
    <section className="relative py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="inline-block mb-4 px-4 py-2 rounded-full border border-cyan-200 bg-white/70 text-cyan-700 text-sm font-semibold tracking-wider uppercase backdrop-blur">
            Collections
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.handle}`}
              className="group relative overflow-hidden rounded-2xl h-64 md:h-80"
            >
              {/* Background Image */}
              {collection.image && (
                <Image
                  data={collection.image}
                  sizes="(min-width: 45em) 500px, 100vw"
                  alt={collection.title || 'Collection'}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {collection.title}
                </h3>
                <p className="text-white/80 mb-4 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {collection.description?.split(' ').slice(0, 8).join(' ')}...
                </p>
                <span className="inline-flex items-center gap-2 text-sky-300 font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300">
                  Explore → 
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
