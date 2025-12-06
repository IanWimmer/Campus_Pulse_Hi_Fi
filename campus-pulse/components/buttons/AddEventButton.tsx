"use client";

import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import clsx from "clsx";

const AddEventButton = ({ onClick = () => {} }: { onClick?: () => void }) => {
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
    <div
      className={clsx(
        "w-12 h-12 border-2 rounded-md flex justify-center items-center transition bg-white",
        clicked
          ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5"
          : "shadow-neobrutalist"
      )}
    >
      <button onClick={() => handleClick()} className="">
        <AddIcon fontSize="large" className="fill-black!" />
      </button>
    </div>
  );
};

export default AddEventButton;
