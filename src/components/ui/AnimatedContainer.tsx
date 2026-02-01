'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Design System - AnimatedContainer Component
 * Generated: 2026-01-31
 * Workflow: brownfield-complete Step 8 - Compose Molecules
 * 
 * Replaces 15+ inline Framer Motion patterns with reusable presets.
 */

export type AnimationPreset =
    | 'fadeSlideUp'
    | 'fadeSlideRight'
    | 'fadeSlideLeft'
    | 'scaleIn'
    | 'fadeIn'
    | 'none';

interface AnimatedContainerProps {
    preset?: AnimationPreset;
    delay?: number;
    duration?: number;
    children: ReactNode;
    className?: string;
}

const animations = {
    fadeSlideUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    fadeSlideRight: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
    fadeSlideLeft: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
    scaleIn: { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 } },
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    none: { initial: {}, animate: {} },
} as const;

function AnimatedContainer({
    preset = 'fadeSlideUp',
    delay = 0,
    duration = 0.5,
    children,
    className,
}: AnimatedContainerProps) {
    const { initial, animate } = animations[preset];

    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={{ duration, delay }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Staggered children animation helper
interface StaggerContainerProps {
    staggerDelay?: number;
    children: ReactNode;
    className?: string;
}

function StaggerContainer({
    staggerDelay = 0.1,
    children,
    className
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

// Stagger child item
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

function StaggerItem({ children, className }: StaggerItemProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}

export { AnimatedContainer, StaggerContainer, StaggerItem };
export type { AnimatedContainerProps };
