"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import React, { useState } from "react";

const PrimaryButton = ({
  onClick = () => {
    false;
  },
  text,
  containerClassName = "",
  buttonClassName = ""
}: {
  onClick?: () => void;
  text: string | React.ReactNode;
  containerClassName?: string;
  buttonClassName?: string;
}) => {
  const delay = 300
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, delay / 2); 
    setTimeout(() => {
      onClick();
    }, delay); 
  };
  return (
    <div className={clsx(containerClassName, "pr-1.5")}>
      <motion.button
        onClick={() => handleClick()}
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
