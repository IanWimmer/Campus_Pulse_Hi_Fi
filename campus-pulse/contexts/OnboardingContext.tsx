'use client'


import React, { createContext, useContext, useEffect, useState } from 'react'

const max_stages = 6

// Step 1: Create Context
const OnboardingContext = createContext({
  state: {
    stage: 0, 
    max_stages: max_stages, 
    done: false,
    selection: Array(max_stages).fill(0)
  }, 
  actions: {
    stage: (newStage: number): void => {}, 
    selection: (stage: number, selection: number): void => {}
  }
})

// Step 2: Create Provider component
export const OnboardingProvider = ({ children}: {children: React.ReactNode }) => {
  const [onboardingStage, setOnboardingStage] = useState<number>(6)
  const [onboardingDone, setOnboardingDone] = useState<boolean>(true)
  const [onboardingSelection, setOnboardingSelection] = useState<number[]>(Array(max_stages).fill(0))

  useEffect(() => {
    if (onboardingStage >= max_stages) {setOnboardingDone(true)}
  }, [onboardingStage])

  return (
    <OnboardingContext.Provider value={{ 
      state: {
        stage: onboardingStage, 
        max_stages: max_stages, 
        done: onboardingDone,
        selection: onboardingSelection
      }, 
      actions: {
        stage: (newStage: number) => setOnboardingStage(newStage),
        selection: (state: number, selection: number) => setOnboardingSelection(prev => {
          const newSelection = [...prev]
          newSelection[state] = selection
          return newSelection
        })
      } 
    }}>
      {children}
    </OnboardingContext.Provider>
  )
}

// Step 3: Create the custom hook to use this context
export const useOnboardingContext = () => {
  return useContext(OnboardingContext)
}