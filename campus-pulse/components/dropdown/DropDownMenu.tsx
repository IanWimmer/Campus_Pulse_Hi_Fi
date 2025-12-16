"use client";

import { ChevronLeftOutlined } from "@mui/icons-material";
import clsx from "clsx";
import { motion } from "motion/react";
import React from "react";
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
  disableChevronCircle = false,
  withStartIcon = false,
  startIcon = null,
  disableStartIconCircle = false,
  className = "",
}: {
  onChange?: (newSelection: string | string[]) => void;
  options?: { label: string | React.ReactNode; value: string }[];
  initialValue?: string | string[];
  withoutShadow?: boolean;
  placeholder?: string | React.ReactNode;
  withPlaceholder?: boolean;
  multiple?: boolean;
  disableChevronCircle?: boolean;
  withStartIcon?: boolean;
  startIcon?: React.ReactNode | null;
  disableStartIconCircle?: boolean;
  className?: string;
}) => {
  if (withStartIcon && !startIcon) throw new Error("Add a startIcon.");

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
    <div ref={dropdownRef} className="w-full">
      <div
        className={clsx(
          "font-secondary flex w-full h-12 items-center justify-between border-2 border-black p-2 pl-5",
          !withoutShadow && "shadow-neobrutalist",
          className
        )}
        onClick={handleOpenChange}
        ref={dropdownButtonRef}
      >
        {withStartIcon && (
          <div
            className={clsx(
              "rounded-full shrink-0 box-content flex justify-center items-center px-1.5",
              disableStartIconCircle ? "border-none" : "border-2 border-black"
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
        <div
          className={clsx(
            "text-nowrap flex-1 overflow-x-hidden",
            withStartIcon ? "max-w-[calc(100%-56px)]" : "max-w-[calc(100%-40px)]",
            selected.length == 0 ||
              (selected.length == 1 && selected.includes(""))
              ? "text-placeholder"
              : "text-black"
          )}
        >
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
        <div
          className={clsx(
            "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
            disableChevronCircle ? "" : "border-2 border-black"
          )}
        >
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
          "absolute max-h-[min(300px,calc(var(--vh,1vh)*30))] px-2 z-50 mt-2 bg-white shadow-neobrutalist-xs border-2 border-black flex flex-col overflow-y-auto"
        )}
        style={{ width: dropdownButtonRef?.current?.offsetWidth }}
        initial={{ opacity: 0, height: 0 }}
        animate={
          isOpen
            ? {
                opacity: 100,
                height: "auto",
                maxHeight: "min(300px,calc(var(--vh,1vh)*30))",
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
