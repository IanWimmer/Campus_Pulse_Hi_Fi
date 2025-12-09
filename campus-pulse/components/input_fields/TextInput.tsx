"use client";

import clsx from "clsx";
import React, { useEffect, useId, useState } from "react";
import { ChangeEvent, useRef, MouseEvent } from "react";

const TextInput = ({
  onChange = (event) => {},
  onFocus = () => {},
  withStartIcon = false,
  startIcon = null,
  startIconBorderDisabled = false,
  withEndIcon = false,
  endIcon = null,
  endIconDeleteEnabled = false,
  endIconBorderDisabled = false,
  onClickEndIcon = (event) => {},
  withPlaceholder = true,
  placeholder = "Search...",
  id = 0,
  type = "text",
  withoutShadow = false,
  className = "",
  value = "",
}: {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
  onFocus?: (newly_focused: boolean) => any;
  withStartIcon?: boolean;
  startIcon?: React.ReactNode | null;
  startIconBorderDisabled?: boolean;
  withEndIcon?: boolean;
  endIcon?: React.ReactNode | null;
  endIconDeleteEnabled?: boolean;
  endIconBorderDisabled?: boolean;
  onClickEndIcon?: (event: MouseEvent) => any;
  withPlaceholder?: boolean;
  placeholder?: string;
  id?: any;
  type?: string;
  withoutShadow?: boolean;
  className?: string;
  value?: string;
}) => {
  if (withEndIcon && !endIcon) throw new Error("Add an endIcon.");
  if (withStartIcon && !startIcon) throw new Error("Add a startIcon.");
  if (id == 0) id = useId();

  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<string>(value);

  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={clsx(
        "h-12 w-full flex items-center border-2 border-black p-2 bg-white",
        !withoutShadow && "shadow-neobrutalist",
        withStartIcon ? "pl-2" : "pl-5",
        className
      )}
    >
      {withStartIcon && (
        <div
          className={clsx(
            "h-7 w-7 rounded-full shrink-0 box-content flex justify-center items-center pr-2",
            startIconBorderDisabled ? "border-none" : "border-2 border-black"
          )}
        >
          {React.isValidElement(startIcon) ? (
            React.cloneElement(startIcon as React.ReactElement<any>, {
              className: clsx(
                "h-[18px] w-[18px] object-contain",
                (startIcon as React.ReactElement<any>)?.props?.className || ""
              ),
            })
          ) : (
            <span className="h-full w-full flex items-center justify-center">
              {startIcon}
            </span>
          )}
        </div>
      )}
      <input
        autoComplete="off"
        type={type}
        ref={inputRef}
        id={id}
        value={internalValue}
        onFocus={() => onFocus(true)}
        onBlur={() => onFocus(false)}
        onChange={(event) => {
          setInternalValue(event.target.value);
          onChange(event);
        }}
        placeholder={withPlaceholder ? placeholder : ""}
        className="font-secondary placeholder:text-placeholder focus:outline-none focus:ring-0 w-full"
      />
      {withEndIcon && (
        <div
          className={clsx(
            "h-7 w-7 rounded-full shrink-0 box-content flex justify-center items-center",
            endIconBorderDisabled ? "border-none" : "border-2 border-black"
          )}
          onClick={(event) => {
            if (endIconDeleteEnabled) {
              setInternalValue("");
              onChange({
                target: { value: "" },
              } as ChangeEvent<HTMLInputElement>);
            }
            onClickEndIcon(event);
          }}
        >
          {React.isValidElement(endIcon) ? (
            React.cloneElement(endIcon as React.ReactElement<any>, {
              className: clsx(
                "h-[18px] w-[18px] object-contain",
                (endIcon as React.ReactElement<any>)?.props?.className || ""
              ),
            })
          ) : (
            <span className="h-full w-full flex items-center justify-center">
              {endIcon}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TextInput;
