import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border-default bg-background-tertiary p-6 transition-all duration-300 ease-out hover:border-border-emphasis hover:shadow-xl hover:shadow-foreground-primary/5 hover:-translate-y-0.5',
        className
      )}
      {...props}
    />
  );
}
