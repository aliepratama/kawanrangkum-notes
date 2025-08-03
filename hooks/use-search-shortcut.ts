'use client'

import { useEffect, useState } from 'react'

export function useSearchShortcut() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsSearchOpen(true)
        return
      }

      // Check for forward slash to open search
      if (event.key === '/' && !isSearchOpen) {
        // Only trigger if not in an input/textarea
        const target = event.target as HTMLElement
        const isInInput = target.tagName === 'INPUT' || 
                         target.tagName === 'TEXTAREA' || 
                         target.contentEditable === 'true'
        
        if (!isInInput) {
          event.preventDefault()
          setIsSearchOpen(true)
        }
      }

      // Close search on Escape
      if (event.key === 'Escape' && isSearchOpen) {
        event.preventDefault()
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen])

  return {
    isSearchOpen,
    setIsSearchOpen,
    openSearch: () => setIsSearchOpen(true),
    closeSearch: () => setIsSearchOpen(false)
  }
}