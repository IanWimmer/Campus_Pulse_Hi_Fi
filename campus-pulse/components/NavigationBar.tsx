"use client";

import { NavigationTabType } from "@/types/types";
import clsx from "clsx";

import { useState } from "react";
import AddEventButton from "./buttons/AddEventButton";

const NavigationBarButton = ({
  tabInfo,
  selected = false,
  onClick = () => {},
}: {
  tabInfo: NavigationTabType;
  selected?: boolean;
  onClick?: (id?: number) => void;
}) => {
  return (
    <div className="w-[25%] flex justify-center items-center">
      <button
        onClick={() => onClick(tabInfo.id)}
        className={clsx(
          "w-[90%] h-11 rounded-full flex justify-center items-center"
        )}
      >
        <div
          className={clsx(selected && "[&_path]:fill-primary-background! z-31")}
        >
          {tabInfo.icon}
        </div>
        {selected && (
          <svg
            width="77"
            height="50"
            viewBox="0 0 77 50"
            fill="none"
            className="absolute"
          >
            <rect
              width="74.5776"
              height="18"
              rx="9"
              transform="matrix(-0.958264 0.285886 0.285886 0.958264 71.4649 7.09766)"
              fill="black"
            />
            <rect
              width="38.2067"
              height="18"
              rx="9"
              transform="matrix(-0.958264 0.285886 0.285886 0.958264 44.5812 0)"
              fill="black"
            />
            <rect
              width="43.6735"
              height="18"
              rx="9"
              transform="matrix(-0.958264 0.285886 0.285886 0.958264 66.8199 20)"
              fill="black"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

const NavigationBar = ({
  onChange = (selected) => {},
  onOpenCreateEvent = () => {},
  options = [],
}: {
  onChange?: (selected: number) => any;
  onOpenCreateEvent?: () => any;
  options: NavigationTabType[];
}) => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <div className="">
      <div className="absolute right-1.5 bottom-20">
        <AddEventButton onClick={() => onOpenCreateEvent()}/>
      </div>
      <div className="w-[calc(100vw-24px)] h-[50px] z-30 ml-2 bg-primary-background border-2 border-black shadow-neobrutalist rounded-full flex justify-between">
        {options.map((tab) => {
          return (
            <NavigationBarButton
              key={tab.id}
              tabInfo={tab}
              selected={selected == tab.id}
              onClick={() => setSelected(tab.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NavigationBar;
