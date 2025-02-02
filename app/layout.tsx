import './globals.css'
import { Atkinson_Hyperlegible } from 'next/font/google'

const atkinson_hyperlegible = Atkinson_Hyperlegible({
  subsets: ['latin'], weight: '400',
})

export const metadata = {
  title: 'Type Master',
  description: 'Created by Nithin S',
}

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-gray-900 text-gray-400">
      <body className={atkinson_hyperlegible.className}>{children}</body>
    </html>
  )
}
