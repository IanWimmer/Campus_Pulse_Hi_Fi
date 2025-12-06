import { ChangeEvent, useRef, useState } from "react";
import clsx from "clsx";

const CheckboxInputForm = ({
  name,
  onChange = (event, []) => {},
  options,
  initialValue = [],
  boxPositions = "start",
}: {
  name: string;
  options: { label: string | React.ReactNode; value: string }[];
  onChange?: (event: ChangeEvent, selection: string[]) => any;
  initialValue?: string[];
  boxPositions?: "start" | "end";
}) => {
  const [selected, setSelected] = useState<string[]>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let nextSelected;
    if (!selected.includes(value)) {
      nextSelected = [...selected, value];
    } else {
      nextSelected = selected.filter((v) => v !== value);
    }
    setSelected(nextSelected);
    onChange(event, nextSelected);
  };

  return (
    <div className="flex flex-col gap-2">
      {options.map((v, i) => {
        return (
          <CheckboxInput
            name={name}
            value={v.value}
            label={v.label}
            id={name + i}
            key={name + i}
            checked={selected.includes(v.value)}
            onChange={(event) => handleChange(event)}
            boxPosition={boxPositions}
          />
        );
      })}
    </div>
  );
};

export const CheckboxInput = ({
  name,
  value,
  onChange = (event) => {},
  id = 0,
  label = "",
  checked = false,
  boxPosition = "start",
}: {
  name: string;
  value: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
  id?: any;
  label?: string | React.ReactNode;
  checked?: boolean;
  boxPosition?: "start" | "end";
}) => {
  const inputId = id?.toString() || `${name}-${value}`;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <label
      htmlFor={inputId}
      className={clsx(
        "min-h-fit h-8 flex items-center cursor-pointer",
        boxPosition === "start" ? "gap-3" : "w-full justify-between"
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => {
          onChange(event);
        }}
        className="sr-only"
      />

      {label && boxPosition === "end" && (
        <div className="font-secondary">{label}</div>
      )}
      <svg
        className={clsx(
          "h-6 aspect-square",
          checked && "shadow-neobrutalist-xs"
        )}
        viewBox="0 0 24 24"
      >
        <rect
          x={0}
          y={0}
          width={24}
          height={24}
          className="fill-primary-background stroke-3 stroke-black"
        />
        {checked && (
          <polyline
            points="18,8 11,16 7,12"
            className="fill-none stroke-black stroke-2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
      {label && boxPosition === "start" && (
        <div className="font-secondary">{label}</div>
      )}
    </label>
  );
};

export default CheckboxInputForm;
