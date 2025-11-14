'use client'


import React, { createContext, useContext, useState } from 'react'

// Step 1: Create Context
const OnboardingContext = createContext({state: false, actions: (newState: boolean): void => {false}})

// Step 2: Create Provider component
export function OnboardingProvider({ children}: {children: React.ReactNode }) {
  const [onboardingDone, setOnboardingDone] = useState<boolean>(false)

  return (
    <OnboardingContext.Provider value={{ state: onboardingDone, actions: (newState:boolean) => setOnboardingDone(newState) }}>
      {children}
    </OnboardingContext.Provider>
  )
}

// Step 3: Create the custom hook to use this context
export function useOnboardingContext() {
  return useContext(OnboardingContext)
}