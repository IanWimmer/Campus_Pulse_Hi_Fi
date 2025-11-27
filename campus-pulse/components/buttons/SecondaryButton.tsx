"use client";

import clsx from "clsx";
import React, { useState } from "react";

const SecondaryButton = ({
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
  const delay = 300;
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
      <button
        onClick={() => handleClick()}
        className={clsx(
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
