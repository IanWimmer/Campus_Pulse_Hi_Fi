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
}: {
  onClick?: () => void;
  text: string | React.ReactNode;
  containerClassName?: string;
  buttonClassName?: string;
}) => {
  const {clicked, handleClick} = useClickAnimation(onClick, {delay: 300});

  return (
    <div className={clsx(containerClassName, "pr-1.5")}>
      <button
        onClick={handleClick}
        className={clsx(
          buttonClassName,
          "w-full h-12 bg-white text-secondary rounded-md border-2 border-black text-xl font-semibold transition",
          clicked
            ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5"
            : "shadow-neobrutalist"
        )}
      >
        {text}
      </button>
    </div>
  );
};

export default SecondaryButton;
