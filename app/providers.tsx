'use client'

import { ReactNode, Suspense } from 'react'
import dynamic from 'next/dynamic'

const SessionProvider = dynamic(() => import('next-auth/react').then(mod => mod.SessionProvider), {
  ssr: false,
})

const FirebaseAuthProvider = dynamic(() => import('./FirebaseAuthProvider').then(mod => mod.FirebaseAuthProvider), {
  ssr: false,
})

const ThemeProvider = dynamic(() => import('@/components/theme-provider').then(mod => mod.ThemeProvider), {
  ssr: false,
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SessionProvider>
        <FirebaseAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </FirebaseAuthProvider>
      </SessionProvider>
    </Suspense>
  )
}