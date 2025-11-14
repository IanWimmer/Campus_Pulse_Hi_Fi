'use client'


import React, { createContext, useContext, useState } from 'react'

// Step 1: Create Context
const LoginContext = createContext({state: false, actions: (newState: boolean): void => {false}})

// Step 2: Create Provider component
export function LoginProvider({ children}: {children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)


  return (
    <LoginContext.Provider value={{ state: loggedIn, actions: (newState: boolean) => setLoggedIn(newState) }}>
      {children}
    </LoginContext.Provider>
  )
}

// Step 3: Create the custom hook to use this context
export function useLoginContext() {
  return useContext(LoginContext)
}