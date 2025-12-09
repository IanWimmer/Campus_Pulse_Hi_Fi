"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const initialVersion = false;

// Step 1: Create Context
const SearchVersionContext = createContext({
  state: initialVersion as boolean | null,
  actions: (newState: boolean): void => {},
});

// Step 2: Create Provider component
export function SearchVersionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [optimizedVersion, setOptimizedVersion] = useState<boolean | null>(
    null
  );

  const key = "campus-pulse-optimized-search-layout";

  const updateEntry = (new_state: boolean) => {
    window.localStorage.setItem(key, String(new_state));
  };

  const getOrCreateEntry = () => {
    if (typeof window === "undefined") return null;

    let entry = window.localStorage.getItem(key);

    if (entry === null) {
      window.localStorage.setItem(key, String(initialVersion));
      return initialVersion;
    }

    return entry === "true" ? true : false;
  };

  useEffect(() => {
    setOptimizedVersion(getOrCreateEntry());
  }, []);

  return (
    <SearchVersionContext.Provider
      value={{
        state: optimizedVersion,
        actions: (newState: boolean) => {
          setOptimizedVersion(newState);
          updateEntry(newState);
        },
      }}
    >
      {children}
    </SearchVersionContext.Provider>
  );
}

// Step 3: Create the custom hook to use this context
export function useSearchVersionContext() {
  return useContext(SearchVersionContext);
}
