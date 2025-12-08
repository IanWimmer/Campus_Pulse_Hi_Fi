"use client";

import AddEventButton from "@/components/buttons/AddEventButton";
import NegativeButton from "@/components/buttons/NegativeButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import Card from "@/components/card/Card";
import Chip from "@/components/chip/Chip";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import CheckboxInputForm from "@/components/input_fields/CheckboxInput";
import DateInput from "@/components/input_fields/DateInput";
import RadioButtonInputForm from "@/components/input_fields/RadioButtonInput";
import TextAreaInput from "@/components/input_fields/TextAreaInput";
import TextInput from "@/components/input_fields/TextInput";
import NavigationBar from "@/components/NavigationBar";
import OnboardingProgressionBar from "@/components/OnboardingProgressionBar";
import ProgressBar from "@/components/progress_bar/ProgressBar";
import Switch from "@/components/switch/Switch";
import EventAvailable from "@/components/icons/EventAvailable";
import HomeFilled from "@/components/icons/HomeFilled";
import MapSearch from "@/components/icons/MapSearch";
import Person from "@/components/icons/Person";

import { useState } from "react";
import Search from "@/components/icons/Search";
import EventDetails from "@/page_components/event_details/EventDetails";
import { NavigationTabType } from "@/types/types";
import { motion } from "motion/react";
import DateTimeInput from "@/components/input_fields/DateTimeInput";

const ComponentsPage = () => {
  const [eventDetails, setEventDetails] = useState<{
    mounted: boolean;
    visible: boolean;
  }>({ mounted: false, visible: false });
  const [enrolled, setEnrolled] = useState<boolean>(false);

  const radioButtonOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  const checkboxButtonOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];

  const dropDownMenuOptions = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
    { label: "Option 3", value: "option3" },
    { label: "Option 4", value: "option4" },
    { label: "Option 5", value: "option5" },
    { label: "Option 6", value: "option6" },
    { label: "Option 11", value: "option11" },
    { label: "Option 12", value: "option12" },
    { label: "Option 13", value: "option13" },
    { label: "Option 14", value: "option14" },
    { label: "Option 15", value: "option15" },
    { label: "Option 16", value: "option16" },
    { label: "Option 21", value: "option21" },
    { label: "Option 22", value: "option22" },
    { label: "Option 23", value: "option23" },
    { label: "Option 24", value: "option24" },
    { label: "Option 25", value: "option25" },
    { label: "Option 26", value: "option26" },
  ];

  const navigationTabs = [
    {
      id: 0,
      icon: <MapSearch className="h-6!" />,
    },
    {
      id: 1,
      icon: <HomeFilled className="h-6!" />,
    },
    {
      id: 2,
      icon: <EventAvailable className="h-6!" />,
    },
    {
      id: 3,
      icon: <Person />,
    },
  ] as NavigationTabType[];

  return (
    <main className="page-container w-full">
      <motion.div
        className="w-full h-full bg-white p-4 pb-[100vh]"
        initial={{ x: "0%" }}
        animate={{ x: eventDetails.visible ? "-100%" : "0%" }}
        transition={{ type: "tween", ease: "easeInOut" }}
      >
        <div>
          <p className="text-xl font-semibold">Onboarding Progression Bar</p>
          <OnboardingProgressionBar
            current_stage={0}
            n_stages={6}
            time_per_page={[5, -1, -1, -1, -1, 5]}
          />
        </div>
        <br />
        <div className="">
          <p className="text-xl font-semibold">Buttons:</p>
          <PrimaryButton text={"PRIMARY"} />
          <br />
          <SecondaryButton text={"SECONDARY"} />
          <br />
          <NegativeButton text={"NEGATIVE"} />
          <br />
          <AddEventButton />
        </div>
        <br />
        <div>
          <p className="text-xl font-semibold">Event Card:</p>
          Compact (for onboarding, search)
          <Card
            title={"Event title"}
            description={
              "Event description - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ..."
            }
          />
          <br />
          Large (for feed)
          <Card
            title={"Event title"}
            datetime={"Time"}
            location={"Place"}
            tall
          />
          <br />
          Enrolled
          <Card
            enrolled
            title={"Event title"}
            datetime={"Time"}
            location={"Place"}
            description={
              "Event description - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ..."
            }
            tall
          />
        </div>
        <br />
        <div>
          <p className="text-xl font-semibold">Input fields:</p>
          Input field with end icon
          <TextInput withEndIcon endIcon={<Search />} id={1} />
          <br />
          Input field
          <TextInput withPlaceholder={false} withoutShadow id={2} />
          <br />
          Date input field (with start icon)
          <DateInput id={3} />
          <br />
          Date and Time input field (with start icon)
          <DateTimeInput id={4} />
          <br />
          Input field (large)
          <TextAreaInput id={5} />
          <br />
          Radio buttons
          <RadioButtonInputForm
            name="radioTest"
            options={radioButtonOptions}
            initialValue="option1"
          />
          <br />
          Checkbox
          <CheckboxInputForm
            name="checkboxTest"
            options={checkboxButtonOptions}
            initialValue={["option1"]}
          />
          <br />
          Switch
          <div className="flex gap-3 items-center">
            <Switch />
            <Switch initialState />
          </div>
          <br />
          Dropdown menu (single)
          <DropDownMenu
            placeholder="Dropdown menu"
            options={dropDownMenuOptions}
            initialValue="option1"
          />
          <br />
          Dropdown menu (multiple)
          <DropDownMenu
            placeholder="Dropdown menu"
            options={dropDownMenuOptions}
            initialValue="option1"
            multiple
          />
        </div>
        <br />
        <div>
          <p className="text-xl font-semibold">Others</p>
          Chip
          <div>
            <div className="flex gap-3 items-center">
              <Chip content="Chip" />
              <Chip content="Chip" initialState />
              <div className="text-xl">(clickable)</div>
            </div>
            <br />
            <div className="flex gap-3 items-center">
              <Chip content="Chip" clickable={false} />
              <div className="text-xl">(not clickable)</div>
            </div>
          </div>
          <br />
          Progress bar
          <ProgressBar content="Progress bar text" progress={50} />
          <br />
          Navigation bar
          <div className="absolute left-0 mt-12">
            <NavigationBar options={navigationTabs} />
          </div>
          <div className="h-26" />
        </div>
        <br />
        <div>
          <p className="text-xl font-semibold">Others</p>
          <PrimaryButton
            text={"Event details"}
            onClick={() => setEventDetails({ mounted: true, visible: true })}
          />
          {eventDetails.mounted && (
            <EventDetails
              onClose={() => {
                setEventDetails({ mounted: true, visible: false });
                setTimeout(() => {
                  setEventDetails({ mounted: false, visible: false });
                }, 300);
              }}
              title="Spontaneous Chess Tournament 🏆"
              time="This Friday, 12:00"
              location="CAB G 61"
              categories={[
                "Boardgames",
                "For all",
                "Spontaneous",
                "Tournament",
              ]}
              participants={6}
              max_participants={8}
              description={
                <p>
                  We’re searching for contestants in a spontaneous chess
                  tournament this Friday at CAB G61. We will organize the boards
                  and clocks and provide snacks and drinks, so all you have to
                  bring is a good mood.
                  <br />
                  <br />
                  Gamemode <br /> We will start with 3 group-phase games, then
                  continue with the elimination game. This is where the real
                  shit happens, and nobody will be able to read this line of
                  text since it is hidden by the button. Anyway, as I was
                  saying, the tournament Lorem ipsum dolor sit amet consectetur
                  adipisicing elit. Nam eum impedit sint est nemo ab voluptatum
                  nobis provident quisquam, omnis eos exercitationem amet vitae
                  possimus quae ullam, dolorem incidunt asperiores?
                </p>
              }
              enrolled={enrolled}
              onEnroll={() => setEnrolled(true)}
              onCancel={() => setEnrolled(false)}
            />
          )}
        </div>
      </motion.div>
    </main>
  );
};

export default ComponentsPage;
