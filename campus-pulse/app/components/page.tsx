"use client";

import AddEventButton from "@/components/buttons/AddEventButton";
import NegativeButton from "@/components/buttons/NegativeButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import Card from "@/components/card/Card";
import Chip from "@/components/chip/Chip";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import CrossCheckAnimated from "@/public/icons/CrossCheckAnimated";
import CheckboxInputForm from "@/components/input_fields/CheckboxInput";
import DateInput from "@/components/input_fields/DateInput";
import RadioButtonInputForm from "@/components/input_fields/RadioButtonInput";
import TextAreaInput from "@/components/input_fields/TextAreaInput";
import TextInput from "@/components/input_fields/TextInput";
import NavigationBar, { NavigationTabType } from "@/components/NavigationBar";
import OnboardingProgressionBar from "@/components/OnboardingProgressionBar";
import ProgressBar from "@/components/progress_bar/ProgressBar";
import Switch from "@/components/switch/Switch";
import EventAvailable from "@/public/icons/EventAvailable";
import HomeFilled from "@/public/icons/HomeFilled";
import MapSearch from "@/public/icons/MapSearch";
import Person from "@/public/icons/Person";

import { useState } from "react";
import Search from "@/public/icons/Search";
import EventDetails from "@/page_components/event_details/EventDetails";

const ComponentsPage = () => {
  const [eventDetails, setEventDetails] = useState<boolean>(false);
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
    <main className="page-container w-full bg-white p-4 pb-[100vh]">
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
        <Card title={"Event title"} datetime={"Time"} location={"Place"} tall />
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
        Input field (large)
        <TextAreaInput id={4} />
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
        Dropdown menu
        <DropDownMenu
          placeholder="Dropdown menu"
          options={dropDownMenuOptions}
          initialValue="option1"
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
        <div className="absolute left-0">
          <NavigationBar options={navigationTabs} />
        </div>
        <div className="h-15" />
      </div>
      <br />
      <div>
        <p className="text-xl font-semibold">Others</p>
        <PrimaryButton
          text={"Event details"}
          onClick={() => setEventDetails(true)}
        />
        {eventDetails && (
          <EventDetails
            onClose={() => {
              setEventDetails(false);
            }}
            title="Spontaneous Chess Tournament 🏆"
            time="This Friday, 12:00"
            location="CAB G 61"
            categories={["Boardgames", "For all", "Spontaneous", "Tournament"]}
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
                continue with the elimination game. This is where the real shit
                happens, and nobody will be able to read this line of text since
                it is hidden by the button. Anyway, as I was saying, the
                tournament Lorem ipsum dolor sit amet consectetur adipisicing
                elit. Nam eum impedit sint est nemo ab voluptatum nobis
                provident quisquam, omnis eos exercitationem amet vitae possimus
                quae ullam, dolorem incidunt asperiores?
              </p>
            }
            enrolled={enrolled}
            onEnroll={() => setEnrolled(true)}
            onCancel={() => setEnrolled(false)}
          />
        )}
      </div>
    </main>
  );
};

export default ComponentsPage;
