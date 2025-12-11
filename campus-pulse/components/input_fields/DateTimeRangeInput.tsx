import clsx from "clsx";
import React, { useState, useRef } from "react";
import { ChangeEvent } from "react";
import CalendarDateAndTimeRangeOutlined from "@/components/icons/CalendarDateAndTimeRangeOutlined";
import { DateTimeRange } from "@/types/types";



const DateTimeRangeInput = ({
  onChange = () => {},
  withIcon = false,
  withPlaceholder = true,
  startPlaceholder = "From",
  endPlaceholder = "To",
  id = "datetime-range",
  withoutShadow = false,
  value = { start: null, end: null } as DateTimeRange,
  className = "",
}: {
  onChange?: (range: DateTimeRange) => any;
  withIcon?: boolean;
  withPlaceholder?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
  id?: string;
  withoutShadow?: boolean;
  value?: DateTimeRange;
  className?: string;
}) => {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState<Date | null>(
    value.start ? new Date(value.start) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    value.end ? new Date(value.end) : null
  );
  const [startISO, setStartISO] = useState<string | null>(value.start);
  const [endISO, setEndISO] = useState<string | null>(value.end);

  const openStartPicker = () => {
    startRef.current?.showPicker?.() || startRef.current?.focus();
  };

  const openEndPicker = () => {
    endRef.current?.showPicker?.() || endRef.current?.focus();
  };

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    
    const val = e.target.value ? new Date(e.target.value) : null;
    setStartDate(val);
    setStartISO(val ? val.toISOString() : null);

    onChange({
      start: val ? val.toISOString() : null,
      end: endISO,
    });
  };

  const handleEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? new Date(e.target.value) : null;
    setEndDate(val);
    setEndISO(val ? val.toISOString() : null);
    onChange({ start: startISO, end: val ? val.toISOString() : null });
  };

  const displayStartText = () => {
    if (!startDate) return withPlaceholder ? startPlaceholder : "";

    const startText = startDate.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return startText;
  };

  const displayEndText = () => {
    if (!endDate) return withPlaceholder ? endPlaceholder : "";

    const endText = endDate.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return endText;
  };

  return (
    <div
      className={clsx("h-12 w-full flex items-center", className)}
      role="textbox"
    >
      {/* Hidden native date inputs */}
      <input
        ref={startRef}
        type="datetime-local"
        value={startDate ? startDate.toISOString().slice(0, 16) : ""}
        onChange={handleStartChange}
        className="sr-only"
        tabIndex={-1}
      />
      <input
        ref={endRef}
        type="datetime-local"
        value={endISO ? endISO.slice(0, 16) : ""}
        onChange={handleEndChange}
        className="sr-only"
        tabIndex={-1}
      />

      {/* Custom visible input */}
      {/*<div className="h-full aspect-square flex items-center justify-center">
        <CalendarDateAndTimeRangeOutlined />
      </div>*/}

      <div
        className={clsx(
          "flex justify-around items-center w-full h-full shadow-neobrutalist-sm border-2 border-black",
          !endDate && !startDate ? "" : "px-2"
        )}
      >
        {!endDate && !startDate && (
          <div className="h-full max-h-9 px-1.5 flex items-center justify-center">
            <CalendarDateAndTimeRangeOutlined className="h-[70%]!" />
          </div>
        )}
        <div className="flex w-full">
          <div
            className="font-secondary shrink text-nowrap overflow-x-hidden w-[calc(50%-13px)]"
            onClick={openStartPicker}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openStartPicker();
              }
            }}
            aria-label="Select date/time start"
          >
            {!startDate && withPlaceholder ? (
              <p className="font-secondary text-placeholder">
                {startPlaceholder}
              </p>
            ) : (
              displayStartText()
            )}
          </div>
          {withPlaceholder || startDate || endDate ? (
            <div className="font-secondary px-1 shrink-0">→</div>
          ) : (
            ""
          )}
          <div
            className="font-secondary shrink text-nowrap overflow-x-hidden w-[calc(50%-13px)]"
            onClick={openEndPicker}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openEndPicker();
              }
            }}
            aria-label="Select date/time end"
          >
            {!endDate && withPlaceholder ? (
              <p className="font-secondary text-placeholder">
                {endPlaceholder}
              </p>
            ) : (
              displayEndText()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeRangeInput;
