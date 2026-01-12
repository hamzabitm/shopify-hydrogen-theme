import {Link} from 'react-router';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function Hero({
  title = 'Premium Gadgets. Smart Living.',
  subtitle = 'Discover cutting-edge technology designed for the modern lifestyle',
  ctaText = 'Explore Collection',
  ctaLink = '/collections/all',
}: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-sky-50" />
        
        {/* Animated Gradient Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-300/30 blur-3xl opacity-30 animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Subtitle */}
        <p className="inline-block mb-6 px-4 py-2 rounded-full border border-sky-200 bg-white/70 text-sky-700 text-sm font-semibold tracking-wider uppercase backdrop-blur">
          Premium Collection
        </p>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-6 leading-tight">
          {title}
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to={ctaLink}
            className="px-10 py-4 bg-sky-600 text-white rounded-lg font-bold text-lg hover:bg-sky-700 transition-all duration-300 hover:shadow-lg hover:shadow-sky-200/60"
          >
            {ctaText}
          </Link>
          <Link
            to="/collections/all"
            className="px-10 py-4 border-2 border-slate-300 text-slate-900 rounded-lg font-bold text-lg hover:bg-slate-900 hover:text-white transition-all duration-300"
          >
            Shop Now
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-slate-200">
          <div className="text-center">
            <div className="text-4xl mb-2">⚡</div>
            <p className="text-slate-600">Premium Quality</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🚚</div>
            <p className="text-slate-600">Fast Delivery</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🛡️</div>
            <p className="text-slate-600">Warranty Included</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-sky-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
