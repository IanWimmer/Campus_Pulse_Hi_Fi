"use client";

import { ChevronLeftOutlined } from "@mui/icons-material";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const DropDownItem = ({
  content = "",
  value = null,
  selected = false,
  onClick = () => {},
}: {
  content?: string | React.ReactNode;
  value?: null | string;
  selected?: boolean;
  onClick?: (value: string) => void;
}) => {
  return (
    <div
      className={clsx(
        "font-secondary hover:bg-neutral-200 h-8 rounded-md flex items-center pl-2 shrink-0 first:mt-2 last:mb-2",
        selected && "bg-primary-background font-medium"
      )}
      onClick={() => onClick(value ? value : "")}
    >
      {content}
    </div>
  );
};

// onChange will only pass on the newly selected option
const DropDownMenu = ({
  onChange = (newSelection) => {},
  options = [],
  initialValue = "",
  withoutShadow = false,
  placeholder = "",
  withPlaceholder = true,
  multiple = false,
}: {
  onChange?: (newSelection: string | string[]) => void;
  options?: { label: string | React.ReactNode; value: string }[];
  initialValue?: string | string[];
  withoutShadow?: boolean;
  placeholder?: string;
  withPlaceholder?: boolean;
  multiple?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(initialValue) ? initialValue : [initialValue]
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLDivElement>(null);

  const handleOpenChange = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (value: string) => {
    if (multiple) {
      setSelected((prev) => {
        if (!Array.isArray(prev)) return prev ? [value, prev] : [value];
        if (prev.includes(value)) return prev.filter((ele) => ele !== value);
        else return [...prev, value];
      });
    } else {
      setSelected([value]);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      console.log(event);
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handler);

    return () => {
      document.removeEventListener("click", handler);
    };
  }, [dropdownRef]);

  useEffect(() => {
    if (multiple) {
      onChange(selected);
    } else {
      onChange(selected[0]);
    }
  }, [selected]);

  return (
    <div ref={dropdownRef}>
      <div
        className={clsx(
          "font-secondary flex w-full h-12 items-center justify-between border-2 border-black p-2 pl-5",
          !withoutShadow && "shadow-neobrutalist"
        )}
        onClick={handleOpenChange}
        ref={dropdownButtonRef}
      >
        <div className="text-nowrap flex-1 max-w-[calc(100%-40px)] overflow-x-hidden">
          {(selected.length == 1 && selected.includes("")) ||
          selected.length == 0
            ? withPlaceholder
              ? placeholder
              : ""
            : options
                .filter((ele) => selected.includes(ele.value))
                ?.map((ele) => {
                  return ele.label;
                })
                .toString()
                .replaceAll(",", ", ")
                .replaceAll(",  ", ", ")}
        </div>
        <div className="h-8 w-8 border-2 border-black rounded-full flex items-center justify-center shrink-0">
          <ChevronLeftOutlined
            sx={{
              transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)",
              transition: "transform 0.3s",
            }}
          />
        </div>
      </div>

      <motion.div
        className={clsx(
          "absolute max-h-[40vh] px-2 z-40 mt-2 bg-white shadow-neobrutalist-xs border-2 border-black flex flex-col overflow-y-auto"
        )}
        style={{ width: dropdownButtonRef?.current?.offsetWidth }}
        initial={{ opacity: 0, height: 0 }}
        animate={
          isOpen
            ? {
                opacity: 100,
                height: "auto",
                maxHeight: "40vh",
              }
            : { opacity: 0, height: 0, maxHeight: 0 }
        }
        transition={{
          opacity: { duration: 0.1, delay: isOpen ? 0 : 0.3 },
          height: { duration: 0.3, ease: "easeInOut" },
          maxHeight: {
            duration: 0.25,
            delay: isOpen ? 0.05 : 0, // Proper delay works on maxHeight
            ease: "easeOut",
          },
        }}
      >
        {options.map((ele, index) => (
          <DropDownItem
            key={ele.value + index}
            content={ele.label}
            selected={selected.includes(ele.value)}
            value={ele.value}
            onClick={handleSelection}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default DropDownMenu;
