'use client'


import { useLoginContext } from '@/contexts/LoginContext'
import { useOnboardingContext } from '@/contexts/OnboardingContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthGuard({ children }: {children: React.ReactNode}) {
  const router = useRouter()
  const pathname = usePathname()
  const loggedIn = useLoginContext().state
  const onboardingDone = useOnboardingContext().state.done

  useEffect(() => {
    if (!loggedIn && pathname !== '/login') {
      router.replace('/login')
    }
    else if (!onboardingDone && (pathname !== '/onboarding' && pathname !== '/login')) {
      router.replace('/onboarding')
    }
  }, [loggedIn, pathname])

  // Optionally, block rendering on protected pages until loggedIn is checked
  if (!loggedIn && pathname !== '/login') return null
  return children
}