"use client"

import React from "react";
import AddIcon from '@mui/icons-material/Add';



const AddEventButton = ({
  onClick = () => {},
}: {
  onClick?: () => void;
}) => {
  return <div className="bg-green-200 rounded-full w-fit">
    <button onClick={() => onClick()} className="">
      <AddIcon fontSize="large" className="fill-black!"/>
    </button>
  </div>
}



export default AddEventButton;