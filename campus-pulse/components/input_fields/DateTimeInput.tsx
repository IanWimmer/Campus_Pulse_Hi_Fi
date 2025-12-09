import clsx from "clsx";
import React, { useState } from "react";
import { ChangeEvent, useRef } from "react";
import CalendarMonthOutlined from "@/components/icons/CalendarMonthOutlined";
import CalendarDateAndTimeOutlined from "@/components/icons/CalendarDateAndTimeOutlined";



const DateTimeInput = ({
  onChange = (event) => {},
  withIcon = false,
  withPlaceholder = true,
  placeholder = "Please select a date and time ... ",
  id = 0,
  withoutShadow = false,
  value = null,
}: {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any,
  withIcon?: boolean,
  withPlaceholder?: boolean
  placeholder?: string,
  id?: any,
  withoutShadow?: boolean,
  value?: string | null
}) => {

  const inputRef = useRef<HTMLInputElement>(null)
  const [datetime, setDatetime] = useState<Date | null>(value ? new Date(value) : null)
  const [datetimeISO, setDatetimeISO] = useState<string | null>(value)
  
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
    const val = new Date(e.target.value)
    setDatetime(val);
    setDatetimeISO(val.toISOString())
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
        type="datetime-local"
        value={datetimeISO ? datetimeISO.slice(0, 16) : ""}
        onChange={handleDateChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        id={id}
      />

      {/* Custom visible input */}
      <div className="h-full aspect-square flex items-center justify-center"><CalendarDateAndTimeOutlined /></div>
      <div
        className={clsx("font-secondary border-2 border-black flex-1 h-full flex items-center pl-5 cursor-pointer select-none", !withoutShadow && "shadow-neobrutalist", !datetime ? "text-placeholder" : "text-black")}
      >
        {datetime ? datetime.toLocaleDateString("de-CH", {day: "2-digit", month: "2-digit", year: "numeric"}) + ", " + datetime.toLocaleTimeString("de-CH", {hour: "2-digit", minute: "2-digit"}) : (withPlaceholder ? placeholder : "")}
      </div>
    </div>
  );
};



export default DateTimeInput