'use client'

import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export function SiteThemeToggle({
  className = '',
  showLabel = true,
}: {
  className?: string
  showLabel?: boolean
}) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl border flex items-center gap-1.5 text-xs font-black transition-all flex-shrink-0 cursor-pointer active:scale-95 select-none ${
        isDark
          ? 'bg-amber-400/10 border-amber-400/40 text-yellow-300 hover:bg-amber-400/20 hover:border-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.2)]'
          : 'bg-indigo-50/90 border-indigo-300 text-indigo-950 hover:bg-indigo-100 shadow-sm'
      } ${className}`}
      title={isDark ? 'Switch to Light Mode / पूरी साइट लाइट मोड करें' : 'Switch to Dark Mode / पूरी साइट डार्क मोड करें'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-in spin-in-180 duration-300 flex-shrink-0" />
          {showLabel && <span className="text-[11px] sm:text-xs font-extrabold text-yellow-300 hidden sm:inline">Light</span>}
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600 animate-in spin-in-180 duration-300 flex-shrink-0" />
          {showLabel && <span className="text-[11px] sm:text-xs font-extrabold text-indigo-900 hidden sm:inline">Dark</span>}
        </>
      )}
    </button>
  )
}
