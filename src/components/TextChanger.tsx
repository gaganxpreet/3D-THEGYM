'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type TextChangerProps = {
  phrases: string[]
  baseText: string
  className?: string
}

export default function TextChanger({ phrases, baseText, className = '' }: TextChangerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)
    
    if (!containerRef.current || !textRef.current) return
    
    // Create a timeline for the text change animation
    const textAnimation = gsap.timeline({
      paused: true,
      onComplete: () => {
        // Update to the next phrase when animation completes
        setCurrentPhrase((prev) => (prev + 1) % phrases.length)
      }
    })
    
    // Animation sequence
    textAnimation
      .to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    
    // Create ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 70%',
      end: 'bottom 30%',
      onEnter: () => textAnimation.play(0),
      onEnterBack: () => textAnimation.play(0),
      onLeave: () => textAnimation.play(0),
      onLeaveBack: () => textAnimation.play(0),
      markers: false // Set to true during development
    })
    
    // Removed mouse movement effect to only trigger on scroll
    
    // Cleanup
    return () => {
      trigger.kill()
    }
  }, [phrases, currentPhrase])
  
  return (
    <div ref={containerRef} className={`text-changer relative ${className}`}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold whitespace-nowrap">
        {baseText} <span ref={textRef} className="text-primary transition-all duration-300 whitespace-nowrap">{phrases[currentPhrase]}</span>
      </h2>
    </div>
  )
}