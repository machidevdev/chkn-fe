import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { jetBrainsMono } from '@/lib/fonts';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors',
          jetBrainsMono.className,
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-transparent text-primary hover:bg-primary/90 border border-primary uppercase hover:text-white':
              variant === 'default',
            'border border-input hover:bg-accent hover:text-accent-foreground':
              variant === 'outline',
            'w-full py-2.5 px-4': size === 'default',
            'h-9 px-3': size === 'sm',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
