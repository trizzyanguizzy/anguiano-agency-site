import type { SVGProps } from 'react';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

type P = SVGProps<SVGSVGElement>;

/**
 * The Anguiano mark: a steep Tudor gable that reads as an "A", with the half-timber
 * brace under the crossbar.
 */
export function LogoMark({ className, ...props }: P) {
  return (
    <svg viewBox="0 0 30 30" fill="none" aria-hidden className={className} {...props}>
      <g stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 26 15 4l11 22" />
        <path d="M8.5 17h13" />
        <path d="M10 17l5 9 5-9" />
      </g>
    </svg>
  );
}

/** Mark on its leaded-glass tile, as on the Home Screen icon. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <span
      className="inline-grid place-items-center rounded-[28%] bg-accent text-background-primary"
      style={{ width: size, height: size }}
    >
      <LogoMark style={{ width: size * 0.68, height: size * 0.68 }} />
    </span>
  );
}

export const HomeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3.5 11 12 4l8.5 7" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5h4v5" />
  </svg>
);

export const MealsIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10" />
    <path d="M17 21V3c-2.2 0-4 2.5-4 6s1.8 5 4 5" />
  </svg>
);

export const CartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 4h2.5l2.2 11h10.6L20.5 7H6.4" />
    <circle cx="9.5" cy="19.5" r="1.2" />
    <circle cx="17" cy="19.5" r="1.2" />
  </svg>
);

export const SwapIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7 4v16M7 4 4 7M7 4l3 3" />
    <path d="M17 20V4M17 20l-3-3M17 20l3-3" />
  </svg>
);

export const BellIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z" />
    <path d="M10 20.5a2 2 0 0 0 4 0" />
  </svg>
);

export const SettingsIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </svg>
);

export const SnowflakeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
    <path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
  </svg>
);
