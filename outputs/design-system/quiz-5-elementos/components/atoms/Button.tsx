'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Design System - Button Component
 * Generated: 2026-01-31
 * Workflow: brownfield-complete Step 7 - Build Atoms
 */

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-fogo text-white shadow-lg hover:bg-fogo-dark hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'border-2 border-warmGray-300 bg-white text-warmGray-700 hover:border-warmGray-400 hover:bg-warmGray-50',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    info: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'text-warmGray-500 hover:text-warmGray-700 hover:bg-warmGray-100',
};

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
    icon: 'p-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isIconOnly = size === 'icon';

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Base classes
                    'inline-flex items-center justify-center gap-2 font-semibold',
                    'transition-all duration-300',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
                    // Rounded based on size
                    isIconOnly ? 'rounded-lg' : 'rounded-xl',
                    // Variant classes
                    variantClasses[variant],
                    // Size classes
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    LeftIcon && <LeftIcon className="w-5 h-5" />
                )}

                {!isIconOnly && children}

                {!isLoading && RightIcon && <RightIcon className="w-5 h-5" />}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
