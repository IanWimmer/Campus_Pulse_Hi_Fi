'use client'

import { LoginProvider } from "@/contexts/LoginContext";
import AuthGuard from "./auth/AuthGuard";



const Providers = ({children}: {children: React.ReactNode}) => {
  return (
    <LoginProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </LoginProvider>
  )
}


export default Providers