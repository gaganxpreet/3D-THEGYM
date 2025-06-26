'use client'

import { ReactNode } from 'react'

type GlassmorphicCardProps = {
  children: ReactNode
  className?: string
}

export default function GlassmorphicCard({
  children,
  className = ''
}: GlassmorphicCardProps) {
  
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-dark/90 border border-primary/20 shadow-lg ${className}`}
    >
      {/* Subtle gold accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10"></div>
      
      {/* Content */}
      <div className="relative p-4">
        {children}
      </div>
    </div>
  )
}