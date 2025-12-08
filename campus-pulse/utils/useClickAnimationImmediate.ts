"use client";

import { useState, useCallback } from "react";

export function useClickAnimationImmediate(
  onClick?: () => void,
  {
    animationDuration = 150,
    disabled = false,
  }: { animationDuration?: number; disabled?: boolean } = {}
) {
  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(() => {
    if (disabled) return;

    onClick?.();

    setClicked(true);
    const t = setTimeout(() => setClicked(false), animationDuration);

    return () => clearTimeout(t);
  }, [disabled, onClick, animationDuration]);

  return { clicked, handleClick };
}
