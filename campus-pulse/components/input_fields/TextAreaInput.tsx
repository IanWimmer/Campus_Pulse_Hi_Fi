import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { ChangeEvent, useRef } from "react";

const TextAreaInput = ({
  onChange = (event) => {},
  withPlaceholder = true,
  placeholder = "",
  id = 0,
  withoutShadow = false,
  heightClass = "h-60",
  value = "",
}: {
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => any;
  withPlaceholder?: boolean;
  placeholder?: string;
  id?: any;
  withoutShadow?: boolean;
  heightClass?: string;
  value?: string;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
        "w-full flex items-center border-2 border-black py-2 px-5",
        !withoutShadow && "shadow-neobrutalist",
        heightClass
      )}
    >
      <textarea
        value={internalValue}
        ref={inputRef}
        id={id}
        onChange={(event) => {setInternalValue(event.target.value);onChange(event)}}
        placeholder={withPlaceholder ? placeholder : ""}
        className="font-secondary placeholder:text-placeholder flex-1 resize-none border-none outline-none bg-transparent h-full w-full focus:outline-none focus:ring-0"
      />
    </div>
  );
};

export default TextAreaInput;
