import clsx from "clsx";
import React from "react";
import { ChangeEvent, useRef } from "react"



const TextInput = ({
  onChange = (event) => {},
  withEndIcon = false,
  endIcon = null,
  withPlaceholder = true,
  placeholder = "Search...",
  id = 0,
  type = "text",
  withoutShadow = false,
}: {
  onChange?: (event: ChangeEvent) => any,
  withEndIcon?: boolean,
  endIcon?: React.ReactNode | null,
  withPlaceholder?: boolean
  placeholder?: string,
  id?: any,
  type?: string,
  withoutShadow?: boolean,
}) => {
  if (withEndIcon && !endIcon) throw new Error("Add an endIcon.");

  const inputRef = useRef<HTMLInputElement>(null)

  return (<div onClick={() => inputRef.current?.focus()} className={clsx("h-12 w-full flex items-center border-2 border-black p-2 pl-5", !withoutShadow && "shadow-neobrutalist")}>
    <input type={type} ref={inputRef} id={id} onChange={(event) => onChange(event)} placeholder={withPlaceholder ? placeholder : ""} className="flex-1 focus:outline-none focus:ring-0"/>
    {withEndIcon && <div className="h-7 w-7 rounded-full border-2 border-black shrink-0 box-content flex justify-center items-center">
      {React.isValidElement(endIcon)
      ? React.cloneElement(endIcon as React.ReactElement<any>, { className: "h-full w-full object-contain" })
      : <span className="h-full w-full flex items-center justify-center">{endIcon}</span>}
    </div>}
  </div>)
}



export default TextInput