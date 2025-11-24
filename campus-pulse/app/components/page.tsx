"use client"

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

import SearchIcon from '@mui/icons-material/Search';
import { useState } from "react";
import Search from "@/public/icons/Search";





const ComponentsPage = () => {
  const radioButtonOptions = [
    {label: "Option 1", value: "option1"},
    {label: "Option 2", value: "option2"}
  ]

  const checkboxButtonOptions = [
    {label: "Option 1", value: "option1"},
    {label: "Option 2", value: "option2"}
  ]

  const dropDownMenuOptions = [
    {label: "Option 1", value: "option1"},
    {label: "Option 2", value: "option2"}
  ]

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


  return <main className="page-container w-full bg-white p-4 pb-[100vh]">
    <div>
      <p className="text-xl font-semibold">Onboarding Progression Bar</p>
      <OnboardingProgressionBar current_stage={0} n_stages={6}  time_per_page={[5, -1, -1, -1, -1, 5]}/>
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
        description={"Event description - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ..."} 
      />
      <br />
      Large (for feed)
      <Card 
        title={"Event title"} 
        datetime={"Time"}
        location={"Place"}
        tall
      />
    </div>
    <br /> 
    <div >
      <p className="text-xl font-semibold">Input fields:</p>
      Input field with end icon
      <TextInput withEndIcon endIcon={<Search />} id={1}/>
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
      <RadioButtonInputForm name="radioTest" options={radioButtonOptions} initialValue="option1" />
      <br />
      Checkbox
      <CheckboxInputForm name="checkboxTest" options={checkboxButtonOptions} initialValue={["option1"]} />
      <br />
      Switch
      <div className="flex gap-3 items-center">
        <Switch />
        <Switch initialState />
      </div>
      <br />
      Dropdown menu
      <DropDownMenu placeholder="Dropdown menu" options={dropDownMenuOptions} initialValue="option1" />
    </div>
    <br />
    <div>
      <p className="text-xl font-semibold">Others</p>
      Chip
      <div>
        <div className="flex gap-3 items-center">
          <Chip content="Chip" />
          <Chip content="Chip" initialState/>
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

        <NavigationBar options={navigationTabs}/>
      </div>
    </div>
      
    
  </main>;
};

export default ComponentsPage;
