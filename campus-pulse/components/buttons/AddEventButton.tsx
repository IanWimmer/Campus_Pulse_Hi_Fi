"use client";

import AddIcon from "@mui/icons-material/Add";
import { useClickAnimation } from "@/utils/useClickAnimation";
import clsx from "clsx";

const AddEventButton = ({ onClick = () => {} }: { onClick?: () => void }) => {
  const {clicked, handleClick} = useClickAnimation(onClick, {delay: 300});

  return (
    <div
      className={clsx(
        "w-12 h-12 border-2 rounded-md flex justify-center items-center transition bg-white flex-30",
        clicked
          ? "shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5"
          : "shadow-neobrutalist"
      )}
    >
      <button onClick={handleClick} className="">
        <AddIcon fontSize="large" className="fill-black!" />
      </button>
    </div>
  );
};

export default AddEventButton;
