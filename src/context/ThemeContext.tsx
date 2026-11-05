'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  const applyThemeToDOM = (t: Theme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      if (t === 'light') {
        root.classList.add('light-mode')
        root.classList.remove('dark')
        root.setAttribute('data-theme', 'light')
        root.style.colorScheme = 'light'
      } else {
        root.classList.remove('light-mode')
        root.classList.add('dark')
        root.setAttribute('data-theme', 'dark')
        root.style.colorScheme = 'dark'
      }
    }
  }

  // Load theme on initial mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('no1domain_theme') as Theme | null
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setThemeState(savedTheme)
        applyThemeToDOM(savedTheme)
      } else {
        // Default to dark theme
        applyThemeToDOM('dark')
      }
    } catch (e) {
      applyThemeToDOM('dark')
    }
  }, [])

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'no1domain_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        const newTheme = e.newValue as Theme
        setThemeState(newTheme)
        applyThemeToDOM(newTheme)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    applyThemeToDOM(newTheme)
    try {
      localStorage.setItem('no1domain_theme', newTheme)
    } catch (e) {
      // Ignore
    }
  }

  const toggleTheme = () => {
    setThemeState((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'light' : 'dark'
      applyThemeToDOM(nextTheme)
      try {
        localStorage.setItem('no1domain_theme', nextTheme)
      } catch (e) {
        // Ignore
      }
      return nextTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
