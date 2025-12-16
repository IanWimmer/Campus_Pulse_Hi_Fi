"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const max_stages = 6;

// Step 1: Create Context
const OnboardingContext = createContext({
  state: {
    stage: 0,
    max_stages: max_stages,
    done: false as boolean | null,
    selection: Array(max_stages).fill(0),
  },
  actions: {
    stage: (newStage: number): void => {},
    selection: (stage: number, selection: number): void => {},
  },
});

// Step 2: Create Provider component
export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [onboardingStage, setOnboardingStage] = useState<number>(-1);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(false);
  const [onboardingSelection, setOnboardingSelection] = useState<number[]>(
    Array(max_stages).fill(0)
  );

  const status_key = "campus-pulse-onboarding-status";
  const selection_key = "campus-pulse-onboarding-selection";

  const getOnboardingStatus = () => {
    if (typeof window === "undefined") return -1;
    const status = window.localStorage.getItem(status_key);

    if (status === null) {
      updateOnboardingStatus(0);
      return 0;
    }
    return Number(status);
  };

  const getOnboardingSelection = () => {
    if (typeof window === "undefined") return null;

    const selection = window.localStorage.getItem(selection_key);

    if (selection === null) {
      updateOnboardingSelection(Array(max_stages).fill(0));
      return Array(max_stages).fill(0) as number[];
    }

    return JSON.parse(selection) as number[];
  };

  const updateOnboardingSelection = (new_selection: number[]) => {
    if (typeof window === "undefined") return null;

    window.localStorage.setItem(selection_key, JSON.stringify(new_selection));
    return new_selection;
  };

  const updateOnboardingStatus = (new_state: number) => {
    if (typeof window === "undefined") return -1;

    window.localStorage.setItem(status_key, String(new_state));
    return new_state;
  };

  useEffect(() => {
    if (onboardingStage >= max_stages) {
      setOnboardingDone(true);
    }
  }, [onboardingStage]);

  useEffect(() => {
    const status = getOnboardingStatus();
    if (status > -1) {
      setOnboardingStage(status);
    }

    const selection = getOnboardingSelection();
    if (selection !== null) {
      setOnboardingSelection(selection);
    }
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        state: {
          stage: onboardingStage,
          max_stages: max_stages,
          done: onboardingDone,
          selection: onboardingSelection,
        },
        actions: {
          stage: (newStage: number) => {
            setOnboardingStage(newStage);
            updateOnboardingStatus(newStage);
          },
          selection: (state: number, selection: number) => {
            setOnboardingSelection((prev) => {
              const newSelection = [...prev];
              newSelection[state] = selection;
              return newSelection;
            });
            const prev = getOnboardingSelection();
            if (prev === null) {
              return
            }
            prev[state] = selection;
            updateOnboardingSelection(prev);
          },
        },
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// Step 3: Create the custom hook to use this context
export const useOnboardingContext = () => {
  return useContext(OnboardingContext);
};
