"use client"

import clsx from "clsx";
import React from "react";




const NegativeButton = ({
  onClick = () => {false},
  text,
  containerClassName = "",
}: {
  onClick?: () => void;
  text: string | React.ReactElement;
  containerClassName?: string;
}) => {
  return <div className={clsx(containerClassName, "pr-1.5")}>
    <button onClick={() => onClick()} className="w-full h-12 bg-negative text-white rounded-md shadow-neobrutalist border-2 border-black text-xl font-semibold">
      {text}
    </button>
  </div>
}



export default NegativeButton;