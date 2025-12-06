import clsx from "clsx";
import React, { useState } from "react";

const Chip = ({
  onClick = () => {},
  clickable = true,
  initialState = false,
  content = "",
}: {
  onClick?: () => void;
  clickable?: boolean;
  initialState?: boolean;
  content?: string | React.ReactNode;
}) => {
  const delay = 300;
  const [clicked, setClicked] = useState(false);
  const [active, setActive] = useState<boolean>(initialState);

  const handleClick = () => {
    if (clickable) {
      setActive(!active);
      setClicked(true);
      setTimeout(() => {
        setClicked(false);
      }, delay / 2);
      setTimeout(() => {
        onClick();
      }, delay);
    }
  };

  return (
    <button
      className={clsx(
        "font-secondary h-8 border-2 border-black w-fit flex items-center justify-center rounded-md transition",
        active ? "bg-primary text-white" : "bg-white text-black",
        clickable && clicked
          ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1 translate-y-1"
          : clickable && "shadow-neobrutalist-sm"
      )}
      onClick={handleClick}
    >
      <span className="px-3 text-nowrap">{content}</span>
    </button>
  );
};

export default Chip;
