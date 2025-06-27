'use client';

import { LazyMotion, domAnimation, m } from 'framer-motion';

/**
 * OptimizedAnimation component that uses LazyMotion to reduce bundle size
 * This approach reduces the initial Framer Motion bundle from ~34KB to ~6KB
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {Object} props.initial - Initial animation state
 * @param {Object} props.animate - Target animation state
 * @param {Object} props.exit - Exit animation state
 * @param {Object} props.transition - Animation transition settings
 * @param {string} props.className - Additional CSS classes
 */
export default function OptimizedAnimation({
  children,
  initial = { opacity: 0, y: 20 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -20 },
  transition = { duration: 0.5 },
  className = "",
  ...props
}) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

/**
 * Fade animation preset
 */
export const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

/**
 * Slide up animation preset
 */
export const slideUpAnimation = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
  transition: { duration: 0.4 }
};

/**
 * Slide in from left animation preset
 */
export const slideInLeftAnimation = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
  transition: { duration: 0.5 }
};

/**
 * Scale animation preset
 */
export const scaleAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.2 },
  transition: { duration: 0.4 }
};