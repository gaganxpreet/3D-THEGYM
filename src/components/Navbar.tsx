'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Classes', path: '/classes' },
  { name: 'Personal Training', path: '/personal-training' },
  { name: 'Membership', path: '/membership' },
  { name: 'Workout AI', path: '/workout-ai' },
  { name: 'Calorie Counter', path: '/calorie-counter' },
  { name: 'Fitness Assessment', path: '/fitness-assessment' },
]

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-dark/80 border-b border-white/10 shadow-lg">
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">3D The Gym</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.path}
                className="nav-link text-sm font-medium hover:text-primary transition-all duration-300 py-2"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-card transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <FiSun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <FiMoon className="w-5 h-5 text-primary" />
                )}
              </button>
            )}

            <button
              className="md:hidden p-2 rounded-full hover:bg-card transition-colors duration-300"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark/95 backdrop-blur-lg shadow-lg">
          <div className="container-custom px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="block py-3 px-4 text-base font-medium nav-link hover:bg-card/50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}