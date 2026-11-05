import type { Metadata } from 'next'
import { ListingsClient } from './ListingsClient'

export const metadata: Metadata = {
  title: '',
  alternates: {
    canonical: 'https://no1domain.in/',
  },
}

export default function ListingsPage() {
  return <ListingsClient />
}