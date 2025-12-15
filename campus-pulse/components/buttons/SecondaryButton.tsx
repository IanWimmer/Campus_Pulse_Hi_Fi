"use client";

import { useClickAnimation } from "@/utils/useClickAnimation";
import clsx from "clsx";
import React from "react";

const SecondaryButton = ({
  onClick = () => {
    false;
  },
  text,
  containerClassName = "",
  buttonClassName = "",
  stopPropagation = false,
  disabled = false,
}: {
  onClick?: () => void;
  text: string | React.ReactNode;
  containerClassName?: string;
  buttonClassName?: string;
  stopPropagation?: boolean;
  disabled?: boolean;
}) => {
  const {clicked, handleClick} = useClickAnimation(onClick, {delay: 300});

  return (
    <div className={clsx(containerClassName, "pr-1.5")}>
      <button
        onClick={(event) => {
          if (stopPropagation) {
            event.stopPropagation();
          }
          if (!disabled) handleClick();
        }}
        className={clsx(
          buttonClassName,
          "w-full h-12 bg-white text-secondary rounded-md border-2 border-black text-xl font-semibold transition",
          clicked && !disabled
            ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5"
            : "shadow-neobrutalist",
          disabled ? "bg-zinc-200 text-zinc-600 border-zinc-600" : "bg-white text-secondary  border-black"
        )}
      >
        {text}
      </button>
    </div>
  );
};

export default SecondaryButton;
