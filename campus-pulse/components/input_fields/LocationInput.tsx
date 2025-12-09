import clsx from "clsx";
import React, { useState } from "react";
import { ChangeEvent, useRef } from "react";
import LocationSearch from "@/components/icons/LocationSearch";

const LocationInput = ({
  onChange = (event) => {},
  withIcon = false,
  withPlaceholder = true,
  placeholder = "Where does your event take place?",
  id = 0,
  withoutShadow = false,
  value = ""
}: {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
  withIcon?: boolean;
  withPlaceholder?: boolean;
  placeholder?: string;
  id?: any;
  withoutShadow?: boolean;
  value?: string
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = useState<string>(value);

  // Update date when native picker value changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    onChange(e);
  };

  return (
    <label
      onClick={() => inputRef.current?.focus()}
      className={clsx(" w-full flex items-center h-12")}
    >
      <div className="h-full aspect-square flex items-center justify-center">
        <LocationSearch />
      </div>

      <input
        type="text"
        ref={inputRef}
        id={id}
        value={location}
        autoComplete="off"
        onChange={(event) => handleChange(event)}
        placeholder={withPlaceholder ? placeholder : ""}
        className={clsx(
          "font-secondary placeholder:text-placeholder flex-1 pl-5 cursor-pointer select-none h-full focus:outline-none focus:ring-0 border-2 border-black",
          !withoutShadow && "shadow-neobrutalist"
        )}
      />
    </label>
  );
};

export default LocationInput;
