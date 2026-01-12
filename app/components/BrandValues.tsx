interface BrandValue {
  icon: string;
  title: string;
  description: string;
}

interface BrandValuesProps {
  title?: string;
  subtitle?: string;
  values?: BrandValue[];
}

const defaultValues: BrandValue[] = [
  {
    icon: '✨',
    title: 'Premium Quality',
    description: 'Curated selection of the finest gadgets from world-renowned brands',
  },
  {
    icon: '⚡',
    title: 'Fast Delivery',
    description: 'Get your gadgets delivered quickly and safely to your doorstep',
  },
  {
    icon: '🛡️',
    title: 'Warranty & Support',
    description: 'Complete warranty coverage and 24/7 customer support',
  },
  {
    icon: '💎',
    title: 'Authentic Guarantee',
    description: 'Every product is 100% authentic and directly sourced',
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    description: 'Multiple payment options with encrypted transactions',
  },
  {
    icon: '🔄',
    title: 'Easy Returns',
    description: '30-day hassle-free return policy on all products',
  },
];

export function BrandValues({
  title = 'Why Choose Us',
  subtitle = 'Experience premium gadgets with exceptional service',
  values = defaultValues,
}: BrandValuesProps) {
  return (
    <section className="relative py-20 md:py-32 bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-300/30 blur-3xl opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl border border-slate-200 bg-white hover:border-sky-200 transition-all duration-300 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-sky-700 transition-colors duration-300">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm leading-relaxed">
                {value.description}
              </p>

              {/* Accent Line */}
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-sky-500 to-cyan-500 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
