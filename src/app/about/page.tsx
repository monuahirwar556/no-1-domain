import React from 'react'
import type { Metadata } from 'next'
import { AboutPageClient } from '@/components/about/AboutPageClient'

export const metadata: Metadata = {
  title: '',
  alternates: {
    canonical: 'https://no1domain.in/',
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
