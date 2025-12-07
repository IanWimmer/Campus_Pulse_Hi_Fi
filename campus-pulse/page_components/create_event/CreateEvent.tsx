"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import DateTimeInput from "@/components/input_fields/DateTimeInput";
import ImageInput from "@/components/input_fields/ImageInput";
import LocationInput from "@/components/input_fields/LocationInput";
import TextAreaInput from "@/components/input_fields/TextAreaInput";
import TextInput from "@/components/input_fields/TextInput";
import Switch from "@/components/switch/Switch";
import CrossOutlined from "@/public/icons/CrossOutlined";
import RightArrow from "@/public/icons/RightArrow";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useState } from "react";
import { createPortal } from "react-dom";

type loadingType = {
  image: boolean;
};

const recurrenceOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const categories = [
  "Boardgame",
  "Casual",
  "Spontaneous",
  "Networking",
  "Creative",
  "Art",
  "Adventure",
  "Team",
  "Trivia",
  "Competitive",
  "Outdoor",
  "Food",
  "Icebreaker",
  "Fun",
  "Night",
  "Active",
  "Craft",
  "Relaxing",
  "Wellness",
  "Quick",
  "Music",
  "Community",
  "Learning",
  "Skills",
  "Walk",
  "Dance",
  "Energy",
  "Sports",
  "Workshop",
  "Technology",
  "Lecture",
  "Debate",
  "Film",
  "Performance",
  "Meditation",
  "Volunteering",
  "Charity",
  "Festival",
  "Cultural",
  "Cooking",
  "Book Club",
  "Photography",
  "Yoga",
  "Gaming",
  "Coding",
  "Hiking",
  "Language Exchange",
  "Mindfulness",
  "Business",
  "Startup",
  "Comedy",
];

const CreateEvent = ({
  visible = true,
  onClose = () => {},
}: {
  visible?: boolean;
  onClose?: () => void;
}) => {
  const [show, setShow] = useState(visible);
  const [loading, setLoading] = useState<loadingType>({
    image: false,
  });
  const [loadingDone, setLoadingDone] = useState<boolean>(true);
  const [showRecurring, setShowRecurring] = useState<boolean>(false);
  const [categoriesFocused, setCategoriesFocused] = useState<boolean>(false);

  const [categorySearchSelection, setCategorySearchSelection] =
    useState<string[]>(categories);
  const [categorySelection, setCategorySelection] = useState<string[]>([]);

  const handleClose = () => {
    setShow(false); // Start exit animation
    onClose(); // for full animation call onClose after 300ms delay
  };

  return createPortal(
    <motion.div
      className={clsx(
        "fixed top-0 left-0 w-full h-[calc(var(--vh,1vh)*100)] z-50 pointer-events-auto flex flex-col bg-white overflow-y-scroll"
      )}
      initial={{ x: "100%" }}
      animate={{ x: show ? 0 : "100%" }}
      transition={{ type: "tween", ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="sticky top-0 left-0 h-21 py-2 px-3 shrink-0 bg-white z-43 flex items-end justify-evenly">
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => handleClose()}
        >
          <RightArrow />
        </button>
        <h1 className="w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
          Create event
        </h1>
        <span className="w-8" />
      </div>

      {/* Main */}
      <div
        className={clsx(
          "absolute top-24 left-0 w-full pb-24 box-border flex flex-col gap-6"
        )}
      >
        {/* General */}
        <div className={clsx("mx-7")}>
          <TextInput placeholder="Event title" />
        </div>
        <div className="border-y-2 border-y-black w-full min-h-34 bg-gray-200">
          <ImageInput placeholder="Add a describing image" />
        </div>
        <div className="px-7">
          <TextAreaInput
            heightClass="h-44"
            placeholder="Please provide a description for your event..."
          />
        </div>

        {/* Date */}
        <div>
          <div className="flex items-center pl-7 pr-5.5">
            <span className="mr-2 font-secondary font-bold text-xl">Date</span>
            <span className="bg-black w-full h-0.5 rounded-full mt-1" />
          </div>
          <div className="mt-2 px-7 flex flex-col gap-4">
            <div>
              <DateTimeInput />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-secondary ml-3 font-medium">
                Recurring Event
              </span>
              <Switch onSwitch={(new_state) => setShowRecurring(new_state)} />
            </div>
            {showRecurring && (
              <DropDownMenu
                options={recurrenceOptions}
                placeholder="Please select a recurrence interval..."
              />
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center pl-7 pr-5.5">
            <span className="mr-2 font-secondary font-bold text-xl">
              Location
            </span>
            <span className="bg-black w-full h-0.5 rounded-full mt-1" />
          </div>
          <div className="px-7 mt-2">
            <LocationInput />
          </div>
        </div>

        {/* Participants */}
        <div>
          <div className="flex items-center pl-7 pr-5.5">
            <span className="mr-2 font-secondary font-bold text-xl">
              Participants
            </span>
            <span className="bg-black w-full h-0.5 rounded-full mt-1" />
          </div>
          <div className="px-7 mt-2">
            <TextInput
              placeholder="What is the max amount of participants?"
              type="number"
            />
          </div>
          <div className="px-7 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-secondary ml-3 font-medium">
                Private event
              </span>
              <Switch />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div
          className={clsx(
            categoriesFocused
              ? "fixed top-0 left-0 w-screen h-[calc(var(--vh,1vh)*100)] py-7 bg-white z-44"
              : "relative"
          )}
        >
          <div className={clsx("flex items-center pl-7 pr-5.5")}>
            <span className="mr-2 font-secondary font-bold text-xl">
              Categories
            </span>
            <span className="bg-black w-full h-0.5 rounded-full mt-1" />
            {categoriesFocused && (
              <span
                className="ml-3 pr-2 pt-0.5"
                onClick={() => setCategoriesFocused(false)}
              >
                <CrossOutlined className="h-5! w-5!" />
              </span>
            )}
          </div>
          <div className={clsx("px-7", categoriesFocused ? "mt-4" : "mt-2")}>
            <TextInput
              placeholder="Search for categories"
              onFocus={() => setCategoriesFocused(true)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCategorySearchSelection(
                  categories.filter((ele) =>
                    ele
                      .toLowerCase()
                      .includes(event.target.value?.toLowerCase())
                  )
                );
              }}
              withEndIcon={categoriesFocused}
              endIcon={
                <div className="flex items-center justify-center">
                  <CrossOutlined className="h-3.5!" />
                </div>
              }
              endIconBorderDisabled
              endIconDeleteEnabled
            />
          </div>
          {categoriesFocused && (
            <div className="px-7 mt-2">
              <p className="text-xl font-semibold font-secondary">
                Current selection
              </p>
              {categorySelection.length > 0 ? (
                <div className="max-h-24 h-fit overflow-y-auto flex flex-wrap gap-2">
                  {categorySelection.map((value, index) => {
                    return (
                      <span
                        onClick={() => {
                          setCategorySelection((prev) => {
                            return prev.filter((ele) => ele !== value);
                          });
                        }}
                        key={"selection-" + index}
                        className="bg-primary-background px-2 rounded-md h-7 border border-black flex items-center gap-1"
                      >
                        {value}{" "}
                        <CrossOutlined
                          className="h-3!"
                          stroke="stroke-[var(--color-placeholder)]"
                        />
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-placeholder">
                  No categories selected yet...
                </p>
              )}
              <p className="text-xl font-semibold font-secondary">
                Search results
              </p>
              <div className="overflow-y-auto flex flex-wrap gap-2">
                {categorySearchSelection.map((value, index) => {
                  const selected = categorySelection.includes(value);
                  return (
                    <div
                      key={"searchResult-" + index}
                      onClick={() =>
                        setCategorySelection((prev) => {
                          if (prev.includes(value)) {
                            return prev.filter((ele) => ele !== value);
                          } else {
                            return [...prev, value];
                          }
                        })
                      }
                      className={clsx(
                        "px-2 h-7 flex items-center border border-black rounded-md",
                        selected ? "bg-primary-background" : "bg-zinc-200"
                      )}
                    >
                      {value}
                      {selected && (
                        <CrossOutlined
                          className="h-3!"
                          stroke="stroke-[var(--color-placeholder)]"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {categorySelection.length > 0 && (
            <div className="mt-4 px-7 overflow-hidden">
              <div className="flex gap-2 overflow-x-scroll w-full">
                {categorySelection.map((value, index) => {
                  return (
                    <span
                      onClick={() => {
                        setCategorySelection((prev) => {
                          return prev.filter((ele) => ele !== value);
                        });
                      }}
                      key={"selection-" + index}
                      className="bg-primary-background px-2 rounded-md h-7 border border-black flex items-center gap-1"
                    >
                      {value}{" "}
                      <CrossOutlined
                        className="h-3!"
                        stroke="stroke-[var(--color-placeholder)]"
                      />
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit button */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-42">
        <PrimaryButton text={"Create Event!"} />
      </div>
    </motion.div>,
    document.body
  );
};

export default CreateEvent;
