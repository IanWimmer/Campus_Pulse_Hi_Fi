"use client";

import clsx from "clsx";
import React from "react";
import { useClickAnimation } from "@/utils/useClickAnimation";

const NegativeButton = ({
  onClick = () => {
    false;
  },
  text,
  containerClassName = "",
}: {
  onClick?: () => void;
  text: string | React.ReactElement;
  containerClassName?: string;
}) => {
  const {clicked, handleClick} = useClickAnimation(onClick, {delay: 300})

  return (
    <div className={clsx(containerClassName, "pr-1.5")}>
      <button
        onClick={handleClick}
        className={clsx(
          "w-full h-12 bg-negative text-white rounded-md border-2 border-black text-xl font-semibold transition",
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

export default NegativeButton;
