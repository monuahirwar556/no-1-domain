'use client'

import React from 'react'

interface BrandLogoProps {
  isDark?: boolean
  size?: 'sm' | 'md' | 'lg'
  showTagline?: boolean
}

export function BrandLogo({ isDark = true, size = 'md', showTagline = true }: BrandLogoProps) {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Official Glowing Feather Emblem */}
      <div
        className={`relative ${iconSize} flex-shrink-0 flex items-center justify-center rounded-xl p-1 transition-all duration-300 group-hover:scale-105 ${
          isDark
            ? 'bg-black/70 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
            : 'bg-slate-900 border border-purple-500/30 shadow-[0_4px_12px_rgba(147,51,234,0.25)]'
        }`}
      >
        <img
          src="/images/logo-transparent.png"
          alt="NO. 1 DOMAIN Logo Emblem"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(192,132,252,0.85)]"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 pointer-events-none" />
      </div>

      {/* Brand Text: NO. 1 DOMAIN */}
      <div className="flex flex-col justify-center min-w-0">
        <div className={`flex items-center ${textSize} font-black tracking-tight leading-none`}>
          <span className={isDark ? "text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]" : "text-amber-500"}>NO. 1</span>
          <span className={`ml-1.5 ${isDark ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(236,72,153,0.35)]' : 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 bg-clip-text text-transparent'}`}>
            DOMAIN
          </span>
        </div>
        {showTagline && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[10px] ${isDark ? 'text-amber-400' : 'text-amber-700'} font-extrabold uppercase tracking-wider flex items-center gap-1`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'} animate-pulse`} />
              no1domain.in
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
