'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Design System - Input Component
 * Generated: 2026-01-31
 * Workflow: brownfield-complete Step 7 - Build Atoms
 */

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    error?: boolean;
    errorMessage?: string;
    size?: 'sm' | 'md' | 'lg';
    /** Label association - required for accessibility */
    id?: string;
}

const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            error = false,
            errorMessage,
            size = 'lg',
            disabled,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                <div className="relative">
                    {LeftIcon && (
                        <LeftIcon
                            className={cn(
                                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                                error ? "text-red-400" : "text-warmGray-400"
                            )}
                        />
                    )}

                    <input
                        ref={ref}
                        disabled={disabled}
                        className={cn(
                            // Base classes
                            'w-full rounded-xl border-2 bg-white',
                            'placeholder:text-warmGray-400',
                            'focus:outline-none focus:ring-2',
                            'transition-all duration-200',
                            'disabled:opacity-50 disabled:cursor-not-allowed',

                            // Size classes
                            sizeClasses[size],

                            // Icon padding
                            LeftIcon && 'pl-12',
                            RightIcon && 'pr-12',

                            // Error state
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-warmGray-200 focus:border-fogo focus:ring-fogo/20',

                            className
                        )}
                        {...props}
                    />

                    {RightIcon && (
                        <RightIcon
                            className={cn(
                                "absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5",
                                error ? "text-red-400" : "text-warmGray-400"
                            )}
                        />
                    )}
                </div>

                {error && errorMessage && (
                    <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
