'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type AnimatedSectionProps = {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in'
  delay?: number
  duration?: number
  threshold?: number
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
  threshold = 0.2
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)
    
    if (!sectionRef.current) return
    
    // Set initial state based on animation type
    const element = sectionRef.current
    let initialProps = {}
    
    switch (animation) {
      case 'fade-up':
        initialProps = { y: 50, opacity: 0 }
        break
      case 'fade-in':
        initialProps = { opacity: 0 }
        break
      case 'slide-left':
        initialProps = { x: -100, opacity: 0 }
        break
      case 'slide-right':
        initialProps = { x: 100, opacity: 0 }
        break
      case 'zoom-in':
        initialProps = { scale: 0.8, opacity: 0 }
        break
      default:
        initialProps = { y: 50, opacity: 0 }
    }
    
    // Set initial state
    gsap.set(element, initialProps)
    
    // Create animation
    const anim = gsap.to(element, {
      ...getAnimationProps(animation),
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: `top ${(1 - threshold) * 100}%`,
        toggleActions: 'play none none none',
        markers: false, // Set to true during development
        onUpdate: (self) => {
          // If this is a scroll-bold animation, update the font weight based on scroll progress
          const boldElements = element.querySelectorAll('.scroll-bold');
          if (boldElements.length > 0) {
            // Calculate font weight based on scroll progress (400 = normal, 700 = bold)
            const progress = self.progress;
            const fontWeight = Math.min(400 + Math.round(progress * 300), 700);
            
            // Apply font weight to all bold elements
            boldElements.forEach(el => {
              if (el instanceof HTMLElement) {
                el.style.fontWeight = String(fontWeight);
              }
            });
          }
        }
      }
    })
    
    // Cleanup
    return () => {
      anim.kill()
    }
  }, [animation, delay, duration, threshold])
  
  // Helper function to get animation properties
  const getAnimationProps = (type: string) => {
    switch (type) {
      case 'fade-up':
        return { y: 0, opacity: 1 }
      case 'fade-in':
        return { opacity: 1 }
      case 'slide-left':
        return { x: 0, opacity: 1 }
      case 'slide-right':
        return { x: 0, opacity: 1 }
      case 'zoom-in':
        return { scale: 1, opacity: 1 }
      default:
        return { y: 0, opacity: 1 }
    }
  }
  
  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
}