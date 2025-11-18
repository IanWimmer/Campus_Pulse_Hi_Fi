'use client'

import { LoginProvider } from "@/contexts/LoginContext";
import AuthGuard from "./auth/AuthGuard";
import { OnboardingProvider } from "@/contexts/OnboardingContext";



const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <LoginProvider>
      <OnboardingProvider>
        <AuthGuard>
          {children}
        </AuthGuard>
      </OnboardingProvider>
    </LoginProvider>
  )
}


export default Providers