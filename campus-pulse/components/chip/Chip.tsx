import clsx from 'clsx';
import React, { useState } from 'react'

const Chip = ({
  onClick = () => {},
  clickable = true,
  initialState = false,
  content = "",
}: {
  onClick?: () => void;
  clickable?: boolean;
  initialState?: boolean;
  content?: string | React.ReactNode
}) => {
  const [active, setActive] = useState<boolean>(initialState)

  const handleClick = () => {
    if (clickable) {
      setActive(!active)
    }
  }

  return (
    <button className={clsx(
        "h-8 border-2 border-black min-w-[70px] w-fit flex items-center justify-center rounded-md",
        active ? "bg-primary text-white" : "bg-white text-black",
        clickable && "shadow-neobrutalist-sm"
      )}
      onClick={handleClick}

    >
      {content}
    </button>
  )
}

export default Chip