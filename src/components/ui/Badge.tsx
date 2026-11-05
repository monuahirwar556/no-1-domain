'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gold' | 'silver' | 'bronze'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-dark-100 text-dark-700',
      primary: 'bg-primary-100 text-primary-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-400/30',
      silver: 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/30',
      bronze: 'bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-lg shadow-amber-600/30',
    }

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-sm gap-1.5',
      lg: 'px-3 py-1.5 text-base gap-2',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-semibold rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'success' && 'bg-green-500', variant === 'warning' && 'bg-yellow-500', variant === 'danger' && 'bg-red-500', variant === 'info' && 'bg-blue-500', variant === 'default' && 'bg-dark-500')} />}
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'