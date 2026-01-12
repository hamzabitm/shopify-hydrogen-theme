import {useState} from 'react';
import type {FormEvent} from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real implementation, send email to your newsletter service
    console.log('Newsletter signup:', email);
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-slate-50 to-white">
      {/* Background Accent */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-sky-300/30 blur-3xl opacity-30" />
      </div>

      <div className="max-w-3xl mx-auto px-6 text-center">
        {/* Header */}
        <p className="inline-block mb-4 px-4 py-2 rounded-full border border-sky-200 bg-white/70 text-sky-700 text-sm font-semibold tracking-wider uppercase backdrop-blur">
          Stay Updated
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          Get the Latest Gadgets & Exclusive Deals
        </h2>
        <p className="text-lg text-slate-600 mb-8">
          Subscribe to our newsletter for early access to new releases and special discounts
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-6 py-4 rounded-lg bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-4 focus:ring-sky-100 transition duration-200"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-sky-600 text-white rounded-lg font-bold whitespace-nowrap hover:bg-sky-700 transition-all duration-300 hover:shadow-lg hover:shadow-sky-200/60"
          >
            {submitted ? '✓ Subscribed!' : 'Subscribe'}
          </button>
        </form>

        {/* Privacy Notice */}
        <p className="text-slate-500 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
