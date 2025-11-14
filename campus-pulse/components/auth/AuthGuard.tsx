'use client'


import { useLoginContext } from '@/contexts/LoginContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: {children: React.ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()
  const loggedIn = useLoginContext().state

  useEffect(() => {
    if (!loggedIn && pathname !== '/login') {
      router.replace('/login')
    }
  }, [loggedIn, pathname])

  // Optionally, block rendering on protected pages until loggedIn is checked
  if (!loggedIn && pathname !== '/login') return null
  return children
}