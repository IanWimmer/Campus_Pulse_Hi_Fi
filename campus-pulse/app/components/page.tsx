"use client"

import AddEventButton from "@/components/buttons/AddEventButton";
import NegativeButton from "@/components/buttons/NegativeButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import Card from "@/components/card/Card";
import CheckboxInputForm from "@/components/input_fields/CheckboxInput";
import DateInput from "@/components/input_fields/DateInput";
import RadioButtonInputForm from "@/components/input_fields/RadioButtonInput";
import TextAreaInput from "@/components/input_fields/TextAreaInput";
import TextInput from "@/components/input_fields/TextInput";

import SearchIcon from '@mui/icons-material/Search';





const ComponentsPage = () => {
  const radioButtonOptions = [
    {label: "Option 1", value: "option1"},
    {label: "Option 2", value: "option2"}
  ]

  const checkboxButtonOptions = [
    {label: "Option 1", value: "option1"},
    {label: "Option 2", value: "option2"}
  ]


  return <main className="page-container w-full bg-white p-4 pb-64">
    <div className="">
      Buttons:
      <PrimaryButton text={"PRIMARY"} />
      <br /> 
      <SecondaryButton text={"SECONDARY"} />
      <br />
      <NegativeButton text={"NEGATIVE"} />
      <br />
      <AddEventButton />
    </div>
    <br />
    <div className="">
      Event Card:
      <Card 
        title={"Event title"} 
        description={"Event description - Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor ..."} 
      />
      <br />
      <Card 
        title={"Event title"} 
        datetime={"Time"}
        location={"Place"}
        tall
      />

      <br /> 
      <div >
        Input fields:
        <TextInput withEndIcon endIcon={<SearchIcon />} id={1}/>
        <br />
        <TextInput withPlaceholder={false} withoutShadow id={2} />
        <br />
        <DateInput id={3} />
        <br />
        <TextAreaInput id={4} />
        <br />
        <RadioButtonInputForm name="radioTest" options={radioButtonOptions} initialValue="option1" />
        <br />
        <CheckboxInputForm name="checkboxTest" options={checkboxButtonOptions} initialValue={["option1"]} />
      </div>
      
    </div>
  </main>;
};

export default ComponentsPage;
