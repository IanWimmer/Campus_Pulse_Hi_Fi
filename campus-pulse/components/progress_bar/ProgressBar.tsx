"use client"

import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react'

const ProgressBar = ({
  progress = 50,
  content = "",
  withoutShadow = false,
  className = "",
}: {
  progress?: number; // percentage from 0 to 100
  content?: string | React.ReactNode;
  withoutShadow?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (progress < 0) {
      progress = 0
    } else if (progress > 100) {
      progress = 100
    }
  }, [progress])


  useEffect(() => {
    if (containerRef && containerRef.current) {
      console.log(containerRef.current.offsetWidth)
      setWidth(Math.max(containerRef.current.offsetWidth - 2, 0))
    } else {
      setWidth(0)
    }
  }, [containerRef?.current?.offsetWidth])

  return (
    <div ref={containerRef} className={clsx(className, "w-full h-fit relative")}>
      {containerRef ? <>
        <svg 
          className={clsx(
            "w-[" + (width) + "px]",
            "h-8",
            withoutShadow ? "" : "drop-shadow-[4px_4px_0px_rgba(0,0,0,1.00)]"
          )}
          viewBox={"0 0 " + width + " 32"}
        >
          <rect 
            x={1} 
            y={2}
            width={width ? width - 4 : 0}
            height={24}
            rx={12}
            ry={12}
            className='fill-white'
          />
          <rect 
            x={1} 
            y={3}
            width={width ? (width - 4) * (progress / 100) : 0}
            height={22}
            rx={11}
            ry={11}
            className='fill-primary'
          />
          <rect 
            x={1} 
            y={2}
            width={width ? width - 4 : 0}
            height={24}
            rx={12}
            ry={12}
            className='stroke-2 stroke-black fill-transparent'
          />
        </svg> 
        <div className={clsx(
          "font-secondary absolute bottom-[9px] text-[13px] w-full flex items-center pl-3.5 pr-4",
          progress > 50 ? "text-white justify-baseline" : "text-black justify-end",
        )}>{content}</div>
      </> : ""}
    </div>
  )
}

export default ProgressBar