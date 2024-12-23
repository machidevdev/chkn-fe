import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { jetBrainsMono } from '@/lib/fonts';
import { cva } from 'class-variance-authority';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[var(--button-from)] to-[var(--button-to)] text-white',
        outline:
          'border border-primary bg-transparent hover:bg-primary hover:text-accent-foreground',
        ghost: 'bg-transparent text-white hover:text-primary',
      },
      size: {
        default: 'w-full py-2.5 px-4',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          'disabled:opacity-50 disabled:pointer-events-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
