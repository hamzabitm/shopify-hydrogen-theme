import {useState} from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate API call - replace with actual newsletter service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="newsletter-section">
      <div className="newsletter-content">
        <h2>Join Our Community</h2>
        <p>
          Subscribe to receive exclusive offers, new arrivals, and styling tips
          directly to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'submitting' || status === 'success'}
              className="newsletter-input"
            />
            <button
              type="submit"
              disabled={status === 'submitting' || status === 'success'}
              className="newsletter-button"
            >
              {status === 'submitting' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </button>
          </div>
          {status === 'success' && (
            <p className="newsletter-success">
              Thank you for subscribing! Check your email for a welcome offer.
            </p>
          )}
          {status === 'error' && (
            <p className="newsletter-error">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
        <p className="newsletter-privacy">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}
