import CrossOutlined from "@/components/icons/CrossOutlined";
import TextInput from "@/components/input_fields/TextInput";
import { RoomType } from "@/types/types";
import { LocationOnOutlined } from "@mui/icons-material";
import clsx from "clsx";
import { useEffect, useState } from "react";

export function useRoomSelection<M extends boolean>(multiple: M) {
  type State = M extends true ? RoomType[] | null : RoomType | null;
  return useState<State>(null as State);
}

const RoomSelection = ({
  onClose = () => {},
  onRoomSelectionChange = () => {},
  onRoomSelectionChangeMultiple = () => {},
  multiple = false,
  directCloseSingle = false,
  initialSelection = null,
}: {
  onClose?: () => any;
  onRoomSelectionChange?: (newSelection: RoomType | null) => any;
  onRoomSelectionChangeMultiple?: (newSelection: RoomType[] | null) => any;
  multiple?: boolean;
  directCloseSingle?: boolean;
  initialSelection?: RoomType[] | RoomType | null;
}) => {
  const [roomSearchSelection, setRoomSearchSelection] = useState<RoomType[]>(
    []
  );
  const [rooms, setRooms] = useState<RoomType[]>([]);

  const [roomSelection, setRoomSelection] = useRoomSelection(multiple);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch("api/rooms");

      if (!res.ok) {
        console.error("Failed to fetch rooms");
        return;
      }

      const r = (await res.json()) as RoomType[];
      setRooms(r);
      setRoomSearchSelection(r);
    };

    fetchRooms();

    if (multiple) {
      setRoomSelection(
        Array.isArray(initialSelection)
          ? initialSelection
          : initialSelection !== null
          ? [initialSelection]
          : null
      );
    } else {
      if (Array.isArray(initialSelection)) {
        console.error(
          "Provided initial selection should be a single value but is a list"
        );
      } else {
        setRoomSelection(initialSelection);
      }
    }
  }, []);

  useEffect(() => {
    if (multiple) {
      setRoomSelection(
        Array.isArray(initialSelection)
          ? initialSelection
          : initialSelection !== null
          ? [initialSelection]
          : null
      );
    } else {
      if (Array.isArray(initialSelection)) {
        console.error(
          "Provided initial selection should be a single value but is a list"
        );
      } else {
        if (
          roomSelection &&
          !Array.isArray(roomSelection) &&
          roomSelection.roomName !== initialSelection?.roomName &&
          initialSelection
        ) {
          console.log(initialSelection);
          setRoomSelection(initialSelection);
        } else if (roomSelection === null && initialSelection !== null) {
          console.log(initialSelection);
          setRoomSelection(initialSelection);
        }
      }
    }
  }, [initialSelection]);

  useEffect(() => {
    if (Array.isArray(roomSelection) && multiple) {
      onRoomSelectionChangeMultiple(roomSelection);
    } else if (!Array.isArray(roomSelection) && !multiple) {
      onRoomSelectionChange(roomSelection);
    }
  }, [roomSelection]);

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 w-screen h-[calc(var(--vh,1vh)*100)] py-7 bg-white z-44 flex flex-col"
      )}
    >
      <div className={clsx("flex items-center pl-7 pr-5.5 shrink-0 h-fit")}>
        <span className="mr-2 font-secondary font-bold text-xl">Rooms</span>
        <span className="bg-black w-full h-0.5 rounded-full mt-1" />
        <span className="ml-3 pr-2 pt-0.5" onClick={() => onClose()}>
          <CrossOutlined className="h-5! w-5!" />
        </span>
      </div>

      {/* Searchbar */}
      <div className={clsx("px-7 mt-4 shrink-0 h-fit")}>
        <TextInput
          placeholder="Search for locations"
          onChange={(event) => {
            const value = event.target.value;
            setRoomSearchSelection(
              rooms.filter((room) =>
                room.roomName.toLowerCase().includes(value.toLowerCase())
              )
            );
          }}
          withStartIcon
          startIcon={<LocationOnOutlined />}
          startIconBorderDisabled
          withEndIcon
          endIcon={
            <div className="flex items-center justify-center">
              <CrossOutlined className="h-3.5!" />
            </div>
          }
          endIconBorderDisabled
          endIconDeleteEnabled
        />
      </div>

      {/* Current selection */}
      <div className="px-7 mt-2 shrink-0 h-fit">
        <p className="text-xl font-semibold font-secondary">
          Current selection
        </p>

        {roomSelection !== null ? (
          <div className="max-h-36 h-fit overflow-y-auto flex flex-col">
            {Array.isArray(roomSelection) ? (
              roomSelection.map((value, index) => {
                return (
                  <div
                    className="flex justify-between items-center h-9 px-2 shrink-0"
                    key={"selection-" + index}
                  >
                    {value.roomName}
                    <div
                      className="h-full aspect-square flex justify-center items-center"
                      onClick={() =>
                        setRoomSelection((prev) => {
                          if (
                            !prev ||
                            !Array.isArray(prev) ||
                            (Array.isArray(prev) &&
                              prev.length === 1 &&
                              prev[0].roomName === value.roomName)
                          )
                            return null;
                          return prev.filter(
                            (room) => room.roomName !== value.roomName
                          );
                        })
                      }
                    >
                      <CrossOutlined
                        className="h-3!"
                        stroke="stroke-[var(--color-placeholder)]"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-between items-center h-9 px-2 shrink-0">
                {roomSelection.roomName}
                <div
                  className="h-full aspect-square flex justify-center items-center"
                  onClick={() =>
                    setRoomSelection((prev) => {
                      if (!prev || Array.isArray(prev)) return null;
                      return prev.roomName !== roomSelection.roomName
                        ? prev
                        : null;
                    })
                  }
                >
                  <CrossOutlined
                    className="h-3!"
                    stroke="stroke-[var(--color-placeholder)]"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-placeholder">No locations selected yet...</p>
        )}
      </div>

      {/* Search results */}
      <div className="px-7 mt-2 shrink-0">
        <p className="text-xl font-semibold font-secondary mb-2">
          Search results
        </p>
      </div>
      <div className="px-7 mt-2 flex-1 overflow-y-auto pb-12">
        <div className="flex flex-col">
          {roomSearchSelection.map((value, index) => {
            const currentSelection = roomSelection;
            const isArraySelection = Array.isArray(currentSelection);
            const selected = isArraySelection
              ? currentSelection
                  ?.map((value) => value.roomName)
                  .includes(value.roomName)
              : currentSelection?.roomName === value.roomName;

            return (
              <div
                key={"searchResult-" + index}
                className={clsx(
                  "px-2 h-9 rounded-md flex items-center",
                  selected ? "bg-primary-background" : ""
                )}
                onClick={() =>
                  setRoomSelection((prev) => {
                    const isPrevArray = Array.isArray(prev);
                    if (!prev) {
                      return multiple ? [value] : value;
                    }

                    if (isPrevArray) {
                      if (selected) {
                        return prev.filter(
                          (ele) => ele.roomName !== value.roomName
                        );
                      } else {
                        return [...prev, value];
                      }
                    } else {
                      return prev.roomName !== value.roomName ? value : null;
                    }
                  })
                }
              >
                {value.roomName}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomSelection;
