import clsx from "clsx";
import React from "react";
import { ChangeEvent, useRef } from "react"

const TextAreaInput = ({
  onChange = (event) => {},
  withPlaceholder = true,
  placeholder = "",
  id = 0,
  withoutShadow = false,
  heightClass = "h-60",
}: {
  onChange?: (event: ChangeEvent) => any,
  withPlaceholder?: boolean
  placeholder?: string,
  id?: any,
  withoutShadow?: boolean,
  heightClass?: string,
}) => {

  const inputRef = useRef<HTMLTextAreaElement>(null)

  return (<div onClick={() => inputRef.current?.focus()} className={clsx("w-full flex items-center border-2 border-black p-2 pl-5", !withoutShadow && "shadow-neobrutalist", heightClass)}>
    <textarea 
      ref={inputRef} 
      id={id} 
      onChange={(event) => onChange(event)} 
      placeholder={withPlaceholder ? placeholder : ""} 
      className="font-secondary placeholder:text-placeholder flex-1 resize-none border-none outline-none bg-transparent h-full w-full focus:outline-none focus:ring-0"
    />
  </div>)
}



export default TextAreaInput