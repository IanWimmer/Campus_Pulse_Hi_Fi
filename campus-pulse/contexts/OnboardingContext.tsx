'use client'


import React, { createContext, useContext, useEffect, useState } from 'react'

const max_stages = 5

// Step 1: Create Context
const OnboardingContext = createContext({state: {stage: 0, max_stages: max_stages, done: false}, actions: (newStage: number): void => {false}})

// Step 2: Create Provider component
export function OnboardingProvider({ children}: {children: React.ReactNode }) {
  const [onboardingStage, setOnboardingStage] = useState<number>(0)
  const [onboardingDone, setOnboardingDone] = useState<boolean>(false)

  useEffect(() => {
    if (onboardingStage >= max_stages) {setOnboardingDone(true)}
  }, [onboardingStage])

  return (
    <OnboardingContext.Provider value={{ state: {stage: onboardingStage, max_stages: max_stages, done: onboardingDone}, actions: (newStage: number) => setOnboardingStage(newStage) }}>
      {children}
    </OnboardingContext.Provider>
  )
}

// Step 3: Create the custom hook to use this context
export function useOnboardingContext() {
  return useContext(OnboardingContext)
}