'use client'

import { useEffect, useState } from 'react'

export default function AnimatedCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [hidden, setHidden] = useState(true)
  const [clicked, setClicked] = useState(false)
  const [linkHovered, setLinkHovered] = useState(false)
  
  useEffect(() => {
    // Hide cursor initially until mouse moves
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseenter', onMouseEnter)
      document.addEventListener('mouseleave', onMouseLeave)
      document.addEventListener('mousedown', onMouseDown)
      document.addEventListener('mouseup', onMouseUp)
    }

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const onMouseEnter = () => {
      setHidden(false)
    }

    const onMouseLeave = () => {
      setHidden(true)
    }

    const onMouseDown = () => {
      setClicked(true)
    }

    const onMouseUp = () => {
      setClicked(false)
    }
    
    // Track link hovers
    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', () => setLinkHovered(true))
        el.addEventListener('mouseleave', () => setLinkHovered(false))
      })
    }

    addEventListeners()
    handleLinkHoverEvents()
    
    // Re-run link hover detection when DOM might change
    const observer = new MutationObserver(handleLinkHoverEvents)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      removeEventListeners()
      observer.disconnect()
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <div 
        className={`fixed pointer-events-none z-50 rounded-full mix-blend-difference transition-transform duration-150 ${hidden ? 'opacity-0' : 'opacity-100'} ${clicked ? 'scale-90' : 'scale-100'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: linkHovered ? '60px' : '20px',
          height: linkHovered ? '60px' : '20px',
          backgroundColor: '#fff',
          transform: `translate(-50%, -50%) ${linkHovered ? 'scale(1.5)' : 'scale(1)'}`,
          transition: 'width 0.3s, height 0.3s, transform 0.3s, opacity 0.3s',
        }}
      />
      
      {/* Cursor trail */}
      <div 
        className={`fixed pointer-events-none z-40 rounded-full bg-white/30 mix-blend-difference ${hidden ? 'opacity-0' : 'opacity-60'}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.6s ease-out, opacity 0.3s, width 0.3s, height 0.3s',
          transitionDelay: '0.05s',
        }}
      />
    </>
  )
}