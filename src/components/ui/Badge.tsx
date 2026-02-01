'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Element } from '@/types/quiz';

/**
 * Design System - Badge Component
 * Generated: 2026-01-31
 * Workflow: brownfield-complete Step 7 - Build Atoms
 */

export type BadgeVariant = Element | 'promo' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
    // Element variants
    terra: 'bg-terra/10 text-terra-dark',
    agua: 'bg-agua/10 text-agua-dark',
    ar: 'bg-ar/20 text-ar-dark',
    fogo: 'bg-fogo/10 text-fogo-dark',
    eter: 'bg-eter/10 text-eter-dark',

    // Semantic variants
    promo: 'bg-fogo/10 text-fogo-dark',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
};

function Badge({
    variant = 'fogo',
    children,
    className,
    icon
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
                variantClasses[variant],
                className
            )}
        >
            {icon}
            {children}
        </span>
    );
}

export { Badge };
export type { BadgeProps };
