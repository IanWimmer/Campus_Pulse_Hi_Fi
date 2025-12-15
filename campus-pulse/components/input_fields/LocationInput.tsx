"use client"

import clsx from "clsx";
import React, { useEffect, useState } from "react";
import LocationSearch from "@/components/icons/LocationSearch";
import { RoomType } from "@/types/types";
import RoomSelection from "@/page_components/room_selection/RoomSelection";

const LocationInput = ({
  onChange = (event) => {},
  withPlaceholder = true,
  placeholder = "Where does your event take place?",
  id = 0,
  withoutShadow = false,
  value = "",
}: {
  onChange?: (newSelection: RoomType | null) => any;
  withPlaceholder?: boolean;
  placeholder?: string;
  id?: any;
  withoutShadow?: boolean;
  value?: string;
}) => {
  const [roomSelection, setRoomSelection] = useState<RoomType | null>(null);
  const [roomsOpen, setRoomsOpen] = useState<boolean>(false);

  const fetchRoom = async () => {
      const res = await fetch(`api/rooms/${value}`)

      if (!res.ok) {
        console.error("Failed to fetch room")
        return
      }

      const r = (await res.json()) as RoomType
      setRoomSelection(r)
    }

  // Update date when native picker value changes
  const handleChange = (newSelection: RoomType | null) => {
    setRoomSelection(newSelection);
  };

  useEffect(() => {
    onChange(roomSelection)
  }, [roomSelection])

  useEffect(() => {
    if (value && value !== roomSelection?.roomName)
      fetchRoom();
  }, [value])
  

  return (
    <>
      <button
        onClick={() => setRoomsOpen(true)}
        className={clsx(" w-full flex items-center h-12")}
      >
        <div className="h-full aspect-square flex items-center justify-center">
          <LocationSearch />
        </div>

        <div
          className={clsx(
            "font-secondary flex-1 flex items-center pl-5 cursor-pointer select-none h-full border-2 border-black",
            !withoutShadow && "shadow-neobrutalist",
            roomSelection === null && withPlaceholder && "text-placeholder"
          )}
        >
          {roomSelection !== null
            ? roomSelection.roomName
            : withPlaceholder
            ? placeholder
            : ""}
        </div>
      </button>
      {roomsOpen && (
        <RoomSelection
          onClose={() => setRoomsOpen(false)}
          onRoomSelectionChange={(newSelection) =>
            handleChange(newSelection)
          }
          value={roomSelection}
          directCloseSingle
        />
      )}
    </>
  );
};

export default LocationInput;
