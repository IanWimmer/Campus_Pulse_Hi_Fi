"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import DateTimeInput from "@/components/input_fields/DateTimeInput";
import ImageInput from "@/components/input_fields/ImageInput";
import LocationInput from "@/components/input_fields/LocationInput";
import TextAreaInput from "@/components/input_fields/TextAreaInput";
import TextInput from "@/components/input_fields/TextInput";
import Switch from "@/components/switch/Switch";
import CrossOutlined from "@/components/icons/CrossOutlined";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { EventType } from "@/types/types";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLoginContext } from "@/contexts/LoginContext";


const recurrenceOptions = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

const CreateEvent = ({
  visible = true,
  onClose = () => {},
}: {
  visible?: boolean;
  onClose?: () => void;
}) => {
  const [show, setShow] = useState(visible);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>();
  const [showRecurring, setShowRecurring] = useState<boolean>(false);
  const [categoriesFocused, setCategoriesFocused] = useState<boolean>(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [categorySearchSelection, setCategorySearchSelection] = useState<
    string[]
  >([]);

  const [eventData, setEventData] = useState<EventType>({
    id: "",
    title: "",
    image_path: "",
    description: "",
    datetime: "",
    recurring: false,
    recurrence_intervall: null,
    location: "",
    geo_location: "",
    public_status: "public",
    categories: [],
    max_participants: -1,
    participants: 0,
  });
  const [categorySelection, setCategorySelection] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [enrollOnCreation, setEnrollOnCreation] = useState<boolean>(true);

  const loginContext = useLoginContext();

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("api/categories");

      if (!res.ok) {
        console.error("Failed to fetch categories");
        return;
      }

      const rc = (await res.json()) as string[];
      setCategories(rc);
      setCategorySearchSelection((prev) => {
        return prev.length > 0 ? prev : rc;
      });
    };

    fetchCategories();
  }, []);

  const handleClose = () => {
    setShow(false); // Start exit animation
    onClose(); // for full animation call onClose after 300ms delay
  };

  const handleEventDataChange = (
    key: string,
    value: string | boolean | number | string[]
  ) => {
    setEventData((prev) => {
      // console.log({...prev, [key]: value})
      return { ...prev, [key]: value };
    });
  };

  const onSubmit = async () => {
    const final_data: EventType = {
      ...eventData,
      categories: categorySelection,
    };

    const errors: string[] = [];
    if (!final_data.title.trim()) errors.push("Title is required");
    if (!final_data.description.trim()) errors.push("Description is required");
    if (!final_data.datetime) errors.push("Date and time are required");
    if (!final_data.location.trim()) errors.push("Location is required");
    if (final_data.max_participants <= 0)
      errors.push("Max participants must be greater than 0");
    if (final_data.recurring && !final_data.recurrence_intervall)
      errors.push(
        "Event is labeled as recurring but no recurrence interval was given"
      );

    if (errors.length > 0) {
      // replace with your own toast / UI
      alert(errors.join("\n"));
      return;
    }

    const formData = new FormData();
    formData.append("data", JSON.stringify(final_data));
    formData.append("enroll", JSON.stringify(enrollOnCreation));
    if (imageFile) {
      formData.append("image", imageFile, imageFile.name);
    }

    try {
      setLoadingSubmit(true);

      const res = await fetch("/api/event", {
        method: "POST",
        body: formData,
        headers: { "X-Device-Id": loginContext.state.deviceId },
      });

      if (!res.ok) {
        console.error("Failed to create event", await res.text());
      }

      const created = await res.json();
      // console.log("Event created:", created);
      handleClose();
    } catch (err) {
      console.error("Error creating event", err);
    } finally {
      setLoadingSubmit(false);
    }
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
          <ArrowBack fontSize="large"/>
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
          {/* Title */}
          <TextInput
            placeholder="Event title"
            onChange={(event) =>
              handleEventDataChange("title", event.target.value)
            }
          />
        </div>
        <div className="border-y-2 border-y-black w-full min-h-34 bg-gray-200">
          {/* Image */}
          <ImageInput
            placeholder="Add a describing image"
            onFileSelect={setImageFile}
          />
        </div>
        <div className="px-7">
          {/* Description */}
          <TextAreaInput
            heightClass="h-44"
            placeholder="Please provide a description for your event..."
            onChange={(event) =>
              handleEventDataChange("description", event.target.value)
            }
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
              <DateTimeInput
                onChange={(event) =>
                  handleEventDataChange(
                    "datetime",
                    new Date(event.target.value).toISOString()
                  )
                }
              />
            </div>
            {/* Recurring Event? */}
            <div className="flex items-center justify-between">
              <span className="font-secondary ml-3 font-medium">
                Recurring Event
              </span>
              <Switch
                onSwitch={(new_state) => {
                  setShowRecurring(new_state);
                  handleEventDataChange("recurring", new_state);
                }}
              />
            </div>
            {showRecurring && (
              <DropDownMenu
                options={recurrenceOptions}
                placeholder="Please select a recurrence interval..."
                onChange={(new_selection) =>
                  handleEventDataChange("recurrence_intervall", new_selection)
                }
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
            <LocationInput
              onChange={(newSelection) =>
                handleEventDataChange(
                  "location",
                  newSelection ? newSelection.roomName : ""
                )
              }
            />
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
              onChange={(event) =>
                handleEventDataChange("max_participants", event.target.value)
              }
            />
          </div>
          <div className="px-7 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-secondary ml-3 font-medium">
                Private event
              </span>
              <Switch
                onSwitch={(new_state) =>
                  handleEventDataChange(
                    "public_status",
                    new_state ? "private" : "public"
                  )
                }
              />
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
          {categorySelection.length > 0 && !categoriesFocused && (
            <div className="mt-4 px-7 overflow-hidden z-40">
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
        <div className="px-7 mt-10">
          <div className="flex items-center justify-between">
            <span className="font-secondary ml-3 font-medium">
              Enroll me upon creation
            </span>
            <Switch
              initialState={true}
              onSwitch={(new_state) => setEnrollOnCreation(new_state)}
            />
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="fixed bottom-0 left-0 w-full p-4 z-42">
        <PrimaryButton text={"Create Event!"} onClick={onSubmit} />
      </div>
    </motion.div>,
    document.body
  );
};

export default CreateEvent;
