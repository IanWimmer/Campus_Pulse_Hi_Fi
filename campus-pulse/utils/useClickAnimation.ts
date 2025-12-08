"use client";

import { useState, useCallback } from "react";

type UseClickAnimationOptions = {
  delay?: number;
  disabled?: boolean;
};

export const useClickAnimation = (
  onClick?: () => void,
  { delay = 300, disabled = false }: UseClickAnimationOptions = {}
) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled || !onClick) return;

    setClicked(true);

    // halfway through: reset visual state
    const timeout1 = window.setTimeout(() => {
      setClicked(false);
    }, delay / 2);

    // full delay: run original callback
    const timeout2 = window.setTimeout(() => {
      onClick();
    }, delay);

    // (optional: return cleanup if you want to use this in effects)
    return () => {
      window.clearTimeout(timeout1);
      window.clearTimeout(timeout2);
    };
  }, [onClick, delay, disabled]);

  return { clicked, handleClick };
};
