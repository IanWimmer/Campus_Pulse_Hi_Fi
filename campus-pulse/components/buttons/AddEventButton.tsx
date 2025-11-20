"use client"

import React from "react";
import AddIcon from '@mui/icons-material/Add';



const AddEventButton = ({
  onClick = () => {},
}: {
  onClick?: () => void;
}) => {
  return <div className="w-12 h-12 border-2 rounded-md shadow-neobrutalist flex justify-center items-center">
    <button onClick={() => onClick()} className="">
      <AddIcon fontSize="large" className="fill-black!"/>
    </button>
  </div>
}



export default AddEventButton;