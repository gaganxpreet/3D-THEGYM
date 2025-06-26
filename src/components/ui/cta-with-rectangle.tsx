'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '../../lib/utils';

interface CTAWithRectangleProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  className?: string;
}

export default function CTAWithRectangle({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  className,
}: CTAWithRectangleProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a slight delay for the fade-in effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "relative py-20 overflow-hidden animate-gradient",
      className
    )}>
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-warning/20 opacity-70 animate-gradient"></div>
      <div className="absolute inset-0 bg-dark/80"></div>
      
      {/* Animated glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-warning/5 animate-pulse-slow opacity-50"></div>
      
      {/* Glowing rectangle border with enhanced effects */}
      <div className={cn(
        "absolute inset-x-4 md:inset-x-12 lg:inset-x-24 inset-y-4 border border-primary/50 rounded-lg transition-all duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}>
        {/* Animated glow effect corners with increased intensity */}
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-primary/40 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary/40 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary/40 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary/40 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Additional glow points */}
        <div className="absolute top-1/4 -left-2 w-8 h-8 bg-warning/30 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 -right-2 w-8 h-8 bg-warning/30 rounded-full blur-xl animate-pulse-slow" style={{ animationDelay: '2.5s' }}></div>
        
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg animate-pulse-slow opacity-50"></div>
      </div>
      
      {/* Content with fade-in animation */}
      <div className={cn(
        "container-custom mx-auto px-4 text-center relative z-10 transition-all duration-1000 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      )}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient animate-gradient">{title}</h2>
          <p className={cn(
            "text-lg md:text-xl text-text-secondary mb-8 transition-all duration-1000 delay-300",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            {description}
          </p>
          <div className={cn(
            "flex flex-col sm:flex-row justify-center gap-4 mt-8 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            <Link 
              href={primaryButtonLink} 
              className="relative group overflow-hidden btn-primary rounded-full animate-bounce-slow hover-glow-primary"
            >
              {/* Enhanced button glow effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-500 animate-pulse-slow"></span>
              <span className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></span>
              <span className="relative z-10">{primaryButtonText}</span>
            </Link>
            
            {secondaryButtonText && secondaryButtonLink && (
              <Link 
                href={secondaryButtonLink} 
                className="relative group overflow-hidden btn-secondary rounded-full hover-glow-secondary"
                style={{ animationDelay: '0.5s' }}
              >
                {/* Enhanced button glow effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-secondary to-warning opacity-0 group-hover:opacity-70 blur-xl transition-opacity duration-500 animate-pulse-slow"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-secondary/30 to-warning/30 rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></span>
                <span className="relative z-10">{secondaryButtonText}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Enhanced animated background elements */}
      <div className="absolute top-12 left-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-12 right-12 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-warning/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
      
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute top-3/4 left-2/3 w-2 h-2 bg-secondary rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-warning rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/3 left-1/2 w-2 h-2 bg-primary rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
    </div>
  );
}