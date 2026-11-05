import type { Metadata } from 'next'
import { ContactClient } from './ContactClient'

export const metadata: Metadata = {
  title: '',
  alternates: {
    canonical: 'https://no1domain.in/',
  },
}

export default function ContactPage() {
  return <ContactClient />
}
