"use client";

import { useClickAnimation } from "@/utils/useClickAnimation";
import clsx from "clsx";
import { motion } from "motion/react";
import React from "react";

const PrimaryButton = ({
  onClick = () => {
    false;
  },
  text,
  containerClassName = "",
  buttonClassName = "",
  stopPropagation = false,
}: {
  onClick?: () => void;
  text: string | React.ReactNode;
  containerClassName?: string;
  buttonClassName?: string;
  stopPropagation?: boolean;
}) => {
  const { clicked, handleClick } = useClickAnimation(onClick, { delay: 300 });

  return (
    <div className={clsx(containerClassName, "pr-1.5")}>
      <motion.button
        onClick={(event) => {
          if (stopPropagation) {
            event.stopPropagation();
          }
          handleClick();
        }}
        className={clsx(
          "w-full h-12 bg-primary text-white rounded-md border-2 border-black text-xl font-semibold transition",
          buttonClassName,
          clicked
            ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5"
            : "shadow-neobrutalist"
        )}
      >
        {text}
      </motion.button>
    </div>
  );
};

export default PrimaryButton;
