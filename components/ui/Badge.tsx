import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-normal transition-colors',
        {
          'bg-foreground-primary/8 text-foreground-secondary border border-border-subtle':
            variant === 'default',
          'bg-accent-orange/15 text-accent-orange border border-accent-orange/30':
            variant === 'primary',
          'bg-foreground-primary/12 text-foreground-primary border border-foreground-primary/20':
            variant === 'secondary',
        },
        className
      )}
      {...props}
    />
  );
}
