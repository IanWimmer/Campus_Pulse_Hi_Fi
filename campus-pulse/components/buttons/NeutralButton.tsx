"use client"

import React from "react";




const NeutralButton = ({
  onClick,
  text,
  containerClassName = "",
}: {
  onClick: () => void;
  text: string | React.ReactElement;
  containerClassName?: string;
}) => {
  return <div className={containerClassName}>
    <button onClick={() => onClick()} className="w-full h-full bg-neutral-200 rounded-full">
      {text}
    </button>
  </div>
}



export default NeutralButton;