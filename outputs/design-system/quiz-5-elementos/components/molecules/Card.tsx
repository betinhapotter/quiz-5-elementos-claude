'use client';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Element } from '@/types/quiz';

/**
 * Design System - Card Component
 * Generated: 2026-01-31
 * Workflow: brownfield-complete Step 8 - Compose Molecules
 */

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'selected';
export type GradientVariant = 'dark' | 'fogo' | 'success' | Element;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: CardVariant;
    children: ReactNode;
}

interface GradientCardProps extends HTMLAttributes<HTMLDivElement> {
    gradient?: GradientVariant;
    children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
    default: 'p-6 shadow-sm',
    elevated: 'p-6 sm:p-8 shadow-lg',
    interactive: 'p-4 border-2 border-warmGray-200 cursor-pointer hover:border-fogo hover:shadow-md transition-all',
    selected: 'p-4 border-2 border-fogo bg-fogo/5 shadow-md',
};

const gradientClasses: Record<GradientVariant, string> = {
    dark: 'bg-gradient-to-br from-warmGray-900 to-warmGray-800',
    fogo: 'bg-gradient-to-r from-fogo to-fogo-dark',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600',
    terra: 'bg-gradient-to-r from-terra to-terra-dark',
    agua: 'bg-gradient-to-r from-agua to-agua-dark',
    ar: 'bg-gradient-to-r from-ar to-ar-dark',
    eter: 'bg-gradient-to-r from-eter to-eter-dark',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl bg-white border border-warmGray-100',
                    variantClasses[variant],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

const GradientCard = forwardRef<HTMLDivElement, GradientCardProps>(
    ({ className, gradient = 'dark', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl p-8 text-white',
                    gradientClasses[gradient],
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

GradientCard.displayName = 'GradientCard';

export { Card, GradientCard };
export type { CardProps, GradientCardProps };
