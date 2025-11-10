"use client"

import React from "react";




const SecondaryButton = ({
  onClick,
  text
}: {
  onClick: () => void;
  text: string | React.ReactElement
}) => {
  return <div>
    <button onClick={() => onClick()} className="">

    </button>
  </div>
}



export default SecondaryButton;