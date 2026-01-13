import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

type TrustItem = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
};

const DEFAULT_ITEMS: TrustItem[] = [
  {icon: ShieldCheck, title: 'Secure checkout', subtitle: 'Encrypted payments'},
  {icon: Truck, title: 'Fast shipping', subtitle: 'Tracked delivery'},
  {icon: RotateCcw, title: 'Easy returns', subtitle: '30-day window'},
  {icon: Sparkles, title: 'Warranty included', subtitle: 'Peace of mind'},
];

export function TrustBar({
  items = DEFAULT_ITEMS,
  compact = false,
}: {
  items?: TrustItem[];
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? 'grid grid-cols-2 gap-2 sm:grid-cols-4'
          : 'grid grid-cols-2 gap-3 sm:grid-cols-4'
      }
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className={
              compact
                ? 'flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2'
                : 'flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3'
            }
          >
            <span
              className={
                compact
                  ? 'inline-flex h-8 w-8 items-center justify-center rounded-xl bg-brand-neon/15 text-brand-neon ring-1 ring-brand-neon/25'
                  : 'inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-neon/15 text-brand-neon ring-1 ring-brand-neon/25'
              }
              aria-hidden
            >
              <Icon size={18} />
            </span>
            <div className="min-w-0">
              <div
                className={
                  compact
                    ? 'text-xs font-semibold text-white'
                    : 'text-sm font-semibold text-white'
                }
              >
                {item.title}
              </div>
              {item.subtitle ? (
                <div className="text-xs text-white/60 truncate">
                  {item.subtitle}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
