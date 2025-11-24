import clsx from "clsx";
import React, { useState } from "react";
import { ChangeEvent, useRef } from "react";
import CalendarMonthOutlined from "@/public/icons/CalendarMonthOutlined";



const DateInput = ({
  onChange = (event) => {},
  withIcon = false,
  withPlaceholder = true,
  placeholder = "Search...",
  id = 0,
  withoutShadow = false,
}: {
  onChange?: (event: ChangeEvent) => any,
  withIcon?: boolean,
  withPlaceholder?: boolean
  placeholder?: string,
  id?: any,
  withoutShadow?: boolean,
}) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const [date, setDate] = useState<string>("")
  
  const openNativePicker = () => {
    if (inputRef.current?.showPicker) {
      inputRef.current.showPicker();
    } else {
      // fallback: focus input to open picker on unsupported browsers
      inputRef.current?.focus();
    }
  };

  // Update date when native picker value changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onChange(e)
  };

  return (
    <div className="h-12 w-full flex items-center"
        onClick={openNativePicker}
        role="textbox"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") openNativePicker();
        }}
        aria-label="Select date"
      >
      {/* Hidden native date input */}
      <input
        ref={inputRef}
        type="date"
        value={date}
        onChange={handleDateChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        id={id}
      />

      {/* Custom visible input */}
      <div className="h-full aspect-square flex items-center justify-center"><CalendarMonthOutlined /></div>
      <div
        className={clsx("border-2 border-black flex-1 h-full flex items-center pl-5 cursor-pointer select-none", !withoutShadow && "shadow-neobrutalist")}
      >
        {date || "Select a date..."}
      </div>
    </div>
  );
};



export default DateInput