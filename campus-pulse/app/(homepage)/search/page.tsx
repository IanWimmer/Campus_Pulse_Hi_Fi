"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import Card from "@/components/card/Card";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import CrossOutlined from "@/components/icons/CrossOutlined";
import Search from "@/components/icons/Search";
import DateTimeRangeInput from "@/components/input_fields/DateTimeRangeInput";
import TextInput from "@/components/input_fields/TextInput";
import LoadingPageOverlay from "@/components/loading_page_overlay/LoadingPageOverlay";
import { useLoginContext } from "@/contexts/LoginContext";
import { useSearchVersionContext } from "@/contexts/SearchVersionContext";
import EventDetails from "@/page_components/event_details/EventDetails";
import RoomSelection from "@/page_components/room_selection/RoomSelection";
import RoomSelectionMultiple from "@/page_components/room_selection/RoomSelectionMultiple";
import { DateTimeRange, EventType, RoomType, UserType } from "@/types/types";
import {
  AccountCircleOutlined,
  CategoryOutlined,
  ChevronLeftOutlined,
  GroupOutlined,
  LocationOnOutlined,
  LockPersonOutlined,
} from "@mui/icons-material";
import clsx from "clsx";
import { useEffect, useState } from "react";

const page = () => {
  const [filterOpen, setFilterOpen] = useState<boolean>(true);
  const [events, setEvents] = useState<EventType[] | null>(null);
  const [searchResultEvents, setSearchResultEvents] = useState<
    EventType[] | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false); // loading after clicking on search button
  const [searching, setSearching] = useState<boolean>(true); // currently interacting with the search inputs

  const [detailViewId, setDetailViewId] = useState<string | null>(null);

  const loginContext = useLoginContext();

  // Friends Overlay Variables
  const [friendsOpen, setFriendsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userSearchSelection, setUserSearchSelection] = useState<UserType[]>(
    []
  );

  // Categories Overlay Variables
  const [categoriesFocused, setCategoriesFocused] = useState<boolean>(false);
  const [categorySearchSelection, setCategorySearchSelection] = useState<
    string[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Rooms Overlay Variables
  const [roomsOpen, setRoomsOpen] = useState<boolean>(false);

  // Search input
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [roomSelection, setRoomSelection] = useState<RoomType[] | null>(null);
  const [dateTimeRange, setDateTimeRange] = useState<DateTimeRange | null>(
    null
  );
  const [categorySelection, setCategorySelection] = useState<string[] | null>(
    null
  );
  const [friendsSelection, setFriendsSelection] = useState<UserType[] | null>(
    null
  );
  const [size, setSize] = useState<number | null>(null);
  const [publicPrivate, setPublicPrivate] = useState<
    "public" | "private" | null
  >(null);

  const searchVersionContext = useSearchVersionContext();

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

  const fetchUsers = async () => {
    const res = await fetch("api/user/all");

    if (!res.ok) {
      console.error("Failed to fetch users");
      return [];
    }

    const users = (await res.json()) as UserType[];
    setUsers(users);
    setUserSearchSelection((prev) => {
      return prev.length > 0 ? prev : users;
    });
    return users;
  };

  const fetchEvents = async () => {
    const response = await fetch("/api/events", {
      method: "GET",
      headers: { "X-Device-Id": loginContext.state.deviceId },
    });
    const data = (await response.json()) as EventType[];
    setEvents(data);
    return data;
  };

  const onEventCancel = async (eid: string, withFetch = false as boolean) => {
    if (!eid) {
      console.error("No eventId was provided");
    }

    if (withFetch) {
      await fetch(`api/enrollment/unenroll/${eid}`, {
        method: "PUT",
        headers: { "X-Device-Id": loginContext.state.deviceId },
      });
    }

    handleSearch(true);
  };

  const onEventEnroll = async (eid: string) => {
    if (!eid) {
      console.error("No eventId was provided");
    }

    handleSearch(true);
  };

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const handleSearch = async (refetchEvents = false as boolean) => {
    let filteredEvents = [];
    if (events === null || refetchEvents) {
      filteredEvents = await fetchEvents();
    } else {
      filteredEvents = events;
    }

    /**
     * Overview on search algo
     * 1. Text search input (compared to title and description)
     * 2. Datetime range
     * 3. Size (+- 20% of entered value (min +-2))
     * 4. Public Private
     * 5. Friends
     * 6. Location
     * 7. Categories
     */

    // 1. Text search
    if (searchInput !== null && searchInput.length > 0) {
      filteredEvents = filteredEvents.filter((value) => {
        const titleMatch = value.title
          .toLocaleLowerCase()
          .includes(searchInput.toLocaleLowerCase());
        const descriptionMatch = value.description
          .toLocaleLowerCase()
          .includes(searchInput.toLocaleLowerCase());
        return titleMatch || descriptionMatch;
      });
    }

    // 2. Datetime range
    if (dateTimeRange !== null) {
      if (dateTimeRange.start !== null) {
        const startDate = new Date(dateTimeRange.start).getTime();
        filteredEvents = filteredEvents.filter((value) => {
          const dateTime = new Date(value.datetime).getTime();
          return dateTime >= startDate;
        });
      }

      if (dateTimeRange.end !== null) {
        const endDate = new Date(dateTimeRange.end).getTime();
        filteredEvents = filteredEvents.filter((value) => {
          const dateTime = new Date(value.datetime).getTime();
          return dateTime <= endDate;
        });
      }
    }

    // 3. Size
    if (size !== null && size > 0) {
      const range = Math.max(2, Math.round(size / 5));

      filteredEvents = filteredEvents.filter((value) => {
        return (
          value.max_participants <= size + range &&
          value.max_participants >= size - range
        );
      });
    }

    // 4. Public / Private
    if (publicPrivate !== null) {
      filteredEvents = filteredEvents.filter(
        (value) => value.public_status === publicPrivate
      );
    }

    // 5. Friends
    if (friendsSelection !== null && friendsSelection.length > 0) {
      const friendsEnrollments = friendsSelection
        .map((friend) => {
          return friend.enrollments;
        })
        .flat();
      filteredEvents = filteredEvents.filter((value) => {
        return friendsEnrollments.includes(value.id);
      });
    }

    // 6. Location
    if (roomSelection !== null && roomSelection.length > 0) {
      const roomNames = roomSelection.map((room) => room.roomName);
      filteredEvents = filteredEvents.filter((value) => {
        return roomNames.includes(value.location);
      });
    }

    // 7. Categories
    if (categorySelection?.length) {
      const categorySet = new Set(categorySelection);
      const result = [];

      for (const event of filteredEvents) {
        for (const cat of event.categories) {
          if (categorySet.has(cat)) {
            result.push(event);
            break; // Early exit
          }
        }
      }
      filteredEvents = result;
    }

    setSearchResultEvents(filteredEvents);
    setLoading(false);
  };

  const displayDateTime = (datetime: Date) => {
    const text = datetime.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    return text;
  };

  const TrivialSearchLayout = (
    <>
      <TextInput
        withEndIcon
        endIcon={<Search />}
        onChange={(event) => setSearchInput(event.target.value)}
        value={searchInput === null ? undefined : searchInput}
      />
      <div
        className={clsx(
          "mt-6",
          filterOpen ? "max-h-screen" : "max-h-9 overflow-y-hidden"
        )}
      >
        <div>
          <button
            className="flex justify-between items-center w-full"
            onClick={() => setFilterOpen((prev) => !prev)}
          >
            <p className="font-secondary text-base font-bold">Filters</p>
            <ChevronLeftOutlined
              sx={{
                transform: filterOpen ? "rotate(-90deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          {/* Row 1 */}
          <div className="flex w-full items-center gap-2">
            <div
              className="w-1/2 flex items-center h-9 border-2 border-black shadow-neobrutalist-sm px-1.5"
              onClick={() => setRoomsOpen(true)}
            >
              <LocationOnOutlined />
              <div
                className={clsx(
                  "px-1.5 font-secondary flex items-center gap-2 flex-nowrap overflow-x-scroll"
                )}
              >
                {roomSelection === null || roomSelection.length == 0 ? (
                  <p className="font-secondary text-placeholder">Location</p>
                ) : (
                  roomSelection.map((value, index) => {
                    return (
                      <span
                        key={"location-" + index}
                        className="px-2 rounded-md h-7 flex items-center text-nowrap"
                      >
                        {value.roomName}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
            <div className="w-1/2">
              <DateTimeRangeInput
                className="h-9!"
                onChange={(range) => setDateTimeRange(range)}
                value={
                  dateTimeRange ? dateTimeRange : { start: null, end: null }
                }
              />
            </div>
          </div>

          {/* Row 2 */}
          <div
            className="flex items-center w-full h-9 border-black border-2 shadow-neobrutalist-sm pl-1.5"
            onClick={() => setCategoriesFocused(true)}
          >
            <CategoryOutlined />
            <div
              className={clsx(
                "px-1.5 font-secondary flex gap-2",
                categorySelection === null || categorySelection.length == 0
                  ? ""
                  : "overflow-x-scroll w-full"
              )}
            >
              {categorySelection === null || categorySelection.length == 0 ? (
                <p className="font-secondary text-placeholder">Categories</p>
              ) : (
                categorySelection.map((value, index) => {
                  return (
                    <span
                      key={"category-" + index}
                      className="px-2 rounded-md h-7 flex items-center text-nowrap"
                    >
                      {value}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div
            className="flex items-center w-full h-9 border-black border-2 shadow-neobrutalist-sm pl-1.5"
            onClick={() => {
              setFriendsOpen(true);
            }}
          >
            <AccountCircleOutlined />
            <div
              className={clsx(
                "px-1.5 font-secondary flex gap-2",
                categorySelection === null || categorySelection.length == 0
                  ? ""
                  : "overflow-x-scroll w-full"
              )}
            >
              {friendsSelection === null || friendsSelection.length == 0 ? (
                <p className="font-secondary text-placeholder">Friends</p>
              ) : (
                friendsSelection.map((value, index) => {
                  return (
                    <span
                      key={"selection-" + index}
                      className="px-2 rounded-md h-7 flex items-center text-nowrap"
                    >
                      {value.name}
                    </span>
                  );
                })
              )}
            </div>
          </div>

          {/* Row 4 */}
          <div className="flex full-w items-center gap-2">
            <div className="w-[calc(50%-4px)] flex items-center h-9">
              <TextInput
                className="h-9! shadow-neobrutalist-sm! pl-1.5!"
                withStartIcon
                startIcon={<GroupOutlined />}
                startIconBorderDisabled
                placeholder="Size"
                type="number"
                onChange={(event) => setSize(Number(event.target.value))}
                value={String(size) ? String(size) : undefined}
              />
            </div>
            <div className="w-[calc(50%-4px)]">
              <DropDownMenu
                className="h-9! shadow-neobrutalist-sm! p-0!"
                disableChevronCircle
                options={[
                  { label: "", value: "" },
                  { label: "Public", value: "public" },
                  { label: "Private", value: "private" },
                ]}
                withPlaceholder
                placeholder={"Public / Private"}
                withStartIcon
                startIcon={<LockPersonOutlined sx={{ height: 22 }} />}
                disableStartIconCircle
                onChange={(newSelection) =>
                  setPublicPrivate(
                    newSelection === "public"
                      ? "public"
                      : newSelection === "private"
                      ? "private"
                      : null
                  )
                }
                initialValue={publicPrivate ? publicPrivate : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const OptimizedSearchLayout = (
    <div className="flex flex-col gap-2">
      {/* Row 1 */}
      <TextInput
        withStartIcon
        startIcon={<Search />}
        onChange={(event) => setSearchInput(event.target.value)}
        className="h-9! shadow-neobrutalist-sm pl-1.5!"
        startIconBorderDisabled
        value={searchInput === null ? undefined : searchInput}
      />

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <div
          className="flex items-center h-9 border-black border-2 shadow-neobrutalist-sm pl-1.5"
          onClick={() => {
            setFriendsOpen(true);
          }}
        >
          <AccountCircleOutlined />
          <div
            className={clsx(
              "px-1.5 font-secondary flex gap-2 w-full overflow-x-scroll"
            )}
          >
            {friendsSelection === null || friendsSelection.length == 0 ? (
              <p className="font-secondary text-placeholder">Friends</p>
            ) : (
              friendsSelection.map((value, index) => {
                return (
                  <span
                    key={"selection-" + index}
                    className="px-2 rounded-md h-7 flex items-center text-nowrap "
                  >
                    {value.name}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <div className="">
          <DropDownMenu
            className="h-9! shadow-neobrutalist-sm! p-0!"
            disableChevronCircle
            options={[
              { label: "", value: "" },
              { label: "Public", value: "public" },
              { label: "Private", value: "private" },
            ]}
            withPlaceholder
            placeholder={"Public / Private"}
            withStartIcon
            startIcon={<LockPersonOutlined sx={{ height: 22 }} />}
            disableStartIconCircle
            onChange={(newSelection) =>
              setPublicPrivate(
                newSelection === "public"
                  ? "public"
                  : newSelection === "private"
                  ? "private"
                  : null
              )
            }
            initialValue={publicPrivate ? publicPrivate : undefined}
          />
        </div>
        <div className="flex items-center h-9">
          <TextInput
            className="h-9! shadow-neobrutalist-sm! pl-1.5!"
            withStartIcon
            startIcon={<GroupOutlined />}
            startIconBorderDisabled
            placeholder="Size"
            type="number"
            onChange={(event) => setSize(Number(event.target.value))}
            value={String(size) ? String(size) : undefined}
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex w-full max-w-full items-center gap-2">
        <div
          className="flex-1 flex items-center px-2 w-full max-w-[calc(50%-4px)] h-9 border-black border-2 shadow-neobrutalist-sm pl-1.5"
          onClick={() => setRoomsOpen(true)}
        >
          <LocationOnOutlined />
          <div
            className={clsx(
              "px-1.5 font-secondary flex gap-1 flex-nowrap overflow-x-scroll"
            )}
          >
            {roomSelection === null || roomSelection.length == 0 ? (
              <p className="font-secondary text-placeholder">Location</p>
            ) : (
              roomSelection.map((value, index) => {
                return (
                  <span
                    key={"location-" + index}
                    className="px-2 rounded-md h-7 flex items-center text-nowrap"
                  >
                    {value.roomName}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <div className="flex-1 max-w-[calc(50%-4px)]">
          <DateTimeRangeInput
            className="h-9!"
            onChange={(range) => setDateTimeRange(range)}
            value={dateTimeRange ? dateTimeRange : { start: null, end: null }}
          />
        </div>
      </div>

      {/* Row 4 */}
      <div
        className="flex items-start p-2 full-w h-27 border-black border-2 shadow-neobrutalist-sm pl-1.5"
        onClick={() => setCategoriesFocused(true)}
      >
        <CategoryOutlined />
        <div
          className={clsx(
            "px-1.5 font-secondary flex gap-1 flex-wrap overflow-y-scroll h-full"
          )}
        >
          {categorySelection === null || categorySelection.length == 0 ? (
            <p className="font-secondary text-placeholder">Categories</p>
          ) : (
            categorySelection.map((value, index) => {
              return (
                <span
                  key={"selection-" + index}
                  className="bg-primary-background px-2 rounded-md h-7 flex items-center text-nowrap border border-black"
                >
                  {value}
                </span>
              );
            })
          )}
        </div>
      </div>
    </div>
  );

  const CategoriesOverlay = (
    <div
      className={clsx(
        "fixed top-0 left-0 w-screen h-[calc(var(--vh,1vh)*100)] py-7 bg-white z-44"
      )}
    >
      <div className={clsx("flex items-center pl-7 pr-5.5")}>
        <span className="mr-2 font-secondary font-bold text-xl">
          Categories
        </span>
        <span className="bg-black w-full h-0.5 rounded-full mt-1" />
        <span
          className="ml-3 pr-2 pt-0.5"
          onClick={() => setCategoriesFocused(false)}
        >
          <CrossOutlined className="h-5! w-5!" />
        </span>
      </div>

      {/* Searchbar */}
      <div className={clsx("px-7", categoriesFocused ? "mt-4" : "mt-2")}>
        <TextInput
          placeholder="Search for categories"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setCategorySearchSelection(
              categories.filter((ele) =>
                ele.toLowerCase().includes(event.target.value?.toLowerCase())
              )
            );
          }}
          withStartIcon
          startIcon={<CategoryOutlined />}
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
      <div className="px-7 mt-2">
        <p className="text-xl font-semibold font-secondary">
          Current selection
        </p>
        {categorySelection && categorySelection.length > 0 ? (
          <div className="max-h-24 h-fit overflow-y-auto flex flex-wrap gap-2">
            {categorySelection.map((value, index) => {
              return (
                <span
                  onClick={() => {
                    setCategorySelection((prev) => {
                      if (prev === null) return null;
                      return prev.filter((ele) => ele !== value);
                    });
                  }}
                  key={"selection-" + index}
                  className="bg-primary-background px-2 rounded-md h-7 border border-black flex items-center gap-1"
                >
                  {value}
                  <CrossOutlined
                    className="h-3!"
                    stroke="stroke-[var(--color-placeholder)]"
                  />
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-placeholder">No categories selected yet...</p>
        )}

        {/* Search results */}
        <p className="text-xl font-semibold font-secondary">Search results</p>
        <div className="overflow-y-auto flex flex-wrap gap-2">
          {categorySearchSelection.map((value, index) => {
            const selected = categorySelection?.includes(value);
            return (
              <div
                key={"searchResult-" + index}
                onClick={() =>
                  setCategorySelection((prev) => {
                    if (!prev) {
                      return [value];
                    }
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
    </div>
  );

  const FriendsOverlay = (
    <div
      className={clsx(
        "fixed top-0 left-0 w-screen h-[calc(var(--vh,1vh)*100)] py-7 bg-white z-44"
      )}
    >
      <div className={clsx("flex items-center pl-7 pr-5.5")}>
        <span className="mr-2 font-secondary font-bold text-xl">Friends</span>
        <span className="bg-black w-full h-0.5 rounded-full mt-1" />
        <span
          className="ml-3 pr-2 pt-0.5"
          onClick={() => setFriendsOpen(false)}
        >
          <CrossOutlined className="h-5! w-5!" />
        </span>
      </div>

      {/* Searchbar */}
      <div className={clsx("px-7 mt-4")}>
        <TextInput
          placeholder="Search for friends"
          onChange={(event) => {
            const value = event.target.value;
            console.log(value);
            setUserSearchSelection(
              users.filter((ele) =>
                ele.name.toLowerCase().includes(value.toLowerCase())
              )
            );
          }}
          withStartIcon
          startIcon={<AccountCircleOutlined />}
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
      <div className="px-7 mt-2">
        <p className="text-xl font-semibold font-secondary">
          Current selection
        </p>

        {friendsSelection && friendsSelection.length > 0 ? (
          <div className="max-h-24 h-fit overflow-y-auto flex flex-col gap-1">
            {friendsSelection.map((value, index) => {
              return (
                <div
                  className="flex justify-between items-center h-9 px-2"
                  key={"selection-" + index}
                >
                  {value.name}
                  <div
                    className="h-full aspect-square flex justify-center items-center"
                    onClick={() =>
                      setFriendsSelection((prev) => {
                        if (!prev) return null;
                        return prev.filter((ele) => ele.id !== value.id);
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
            })}
          </div>
        ) : (
          <p className="text-placeholder">No friends selected yet...</p>
        )}
      </div>

      {/* Search results */}
      <div className="px-7 mt-2">
        <p className="text-xl font-semibold font-secondary mb-2">
          Search results
        </p>
        <div className="overflow-y-auto flex flex-col gap-1">
          {userSearchSelection.map((value, index) => {
            const selected = friendsSelection?.includes(value);
            return (
              <div
                key={"searchResult-" + index}
                className={clsx(
                  "px-2 h-9 rounded-md flex items-center",
                  selected && "bg-primary-background"
                )}
                onClick={() =>
                  setFriendsSelection((prev) => {
                    if (!prev) {
                      return [value];
                    }

                    if (selected) {
                      return prev.filter((ele) => ele.id !== value.id);
                    } else {
                      return [...prev, value];
                    }
                  })
                }
              >
                {value.name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const RoomsOverlay = (
    <RoomSelectionMultiple
      onClose={() => setRoomsOpen(false)}
      onRoomSelectionChange={(newSelection) => {
        setRoomSelection(newSelection);
      }}
      value={roomSelection}
    />
  );

  return (
    <div className="flex w-screen h-[calc(var(--vh)*100)] flex-col items-center gap-0 z-10">
      {searching ? (
        <div className="mt-16 mb-4 w-full px-7 shrink-0">
          {searchVersionContext.state
            ? OptimizedSearchLayout
            : TrivialSearchLayout}

          <div className="w-full mt-6 -mr-2">
            <PrimaryButton
              text={"SEARCH"}
              containerClassName="pr-0!"
              onClick={() => {
                setTimeout(() => {
                  setLoading(true);
                  setSearching(false);
                  handleSearch();
                }, 200);
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className="mt-16 mb-4 w-full px-7 shrink-0"
          onClick={() => setSearching(true)}
        >
          <button
            className={clsx(
              "w-full flex items-center justify-between border-2 border-black bg-white p-2 pl-5 font-secondary",
              "h-12 shadow-neobrutalist",
              searchInput === null && "text-placeholder"
            )}
          >
            <span>{searchInput !== null ? searchInput : "Search..."}</span>
            <div
              className={clsx(
                "h-7 w-7 rounded-full shrink-0 box-content flex justify-center items-center",
                "border-2 border-black"
              )}
            >
              <span className="h-full w-full flex items-center justify-center">
                <Search />
              </span>
            </div>
          </button>
          <div className="flex w-full overflow-x-auto pb-2 mt-3 gap-1">
            {roomSelection && (
              <span className="w-fit max-w-40 h-7 shrink-0 border rounded-md border-black text-nowrap overflow-x-hidden flex items-center px-2">
                <span className="overflow-x-hidden">
                  {roomSelection.map((room) => room.roomName).join(", ")}
                </span>
              </span>
            )}
            {dateTimeRange &&
              (dateTimeRange.start !== null || dateTimeRange.end !== null) && (
                <span className="w-fit max-w-40 h-7 shrink-0 border rounded-md border-black text-nowrap overflow-x-hidden flex items-center px-2">
                  <span className="overflow-x-hidden">
                    {(dateTimeRange.start
                      ? displayDateTime(new Date(dateTimeRange.start))
                      : "...") +
                      " - " +
                      (dateTimeRange.end
                        ? displayDateTime(new Date(dateTimeRange.end))
                        : "...")}
                  </span>
                </span>
              )}
            {publicPrivate && (
              <span className="w-fit max-w-40 h-7 shrink-0 border rounded-md border-black text-nowrap overflow-x-hidden flex items-center px-2">
                <span className="overflow-x-hidden">
                  {publicPrivate === "public"
                    ? "Public"
                    : publicPrivate === "private" && "Private"}
                </span>
              </span>
            )}
            {friendsSelection && (
              <span className="w-fit max-w-40 h-7 shrink-0 border rounded-md border-black text-nowrap overflow-x-hidden flex items-center px-2">
                <span className="overflow-x-hidden">
                  {friendsSelection.map((friend) => friend.name).join(", ")}
                </span>
              </span>
            )}
            {categorySelection && (
              <span className="w-fit max-w-40 h-7 shrink-0 border rounded-md border-black text-nowrap overflow-x-hidden flex items-center px-2">
                <span className="overflow-x-hidden">
                  {categorySelection.join(", ")}
                </span>
              </span>
            )}
            {size && (
              <span className="w-fit max-w-40 h-7 shrink-0 border rounded-md border-black text-nowrap overflow-x-hidden flex items-center px-2">
                <span className="overflow-x-hidden">Size: ±{size}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Categories */}
      {categoriesFocused ? CategoriesOverlay : ""}

      {/* Friends */}
      {friendsOpen ? FriendsOverlay : ""}

      {/* Rooms */}
      {roomsOpen ? RoomsOverlay : ""}

      {/* Loading */}
      {loading ? <LoadingPageOverlay /> : ""}

      {/* Results */}
      {searchResultEvents && searchResultEvents.length > 0 ? (
        <div className="flex-1 w-full px-7 flex flex-col gap-4 overflow-y-auto pb-34">
          {searchResultEvents.map((event, index) => {
            return (
              <div
                key={"card-" + index}
                onClick={() => setDetailViewId(event.id)}
              >
                <Card
                  title={event.title}
                  imageSrc={event.image_path}
                  location={event.location}
                  datetime={event.datetime}
                  enrolled={event.user_enrolled}
                  onCancel={async () => {
                    await fetch(`api/enrollment/unenroll/${event.id}`, {
                      method: "PUT",
                      headers: { "X-Device-Id": loginContext.state.deviceId },
                    });
                    setTimeout(() => {
                      handleSearch(true);
                    }, 200);
                  }}
                />
              </div>
            );
          })}
        </div>
      ) : Array.isArray(searchResultEvents) ? (
        <div className="flex-1 w-full text-wrap px-7 flex flex-col gap-4 overflow-y-auto pb-34 font-secondary text-placeholder pl-9">
          {" "}
          No events found matching your description...
        </div>
      ) : (
        ""
      )}

      {/* DetailView */}
      {detailViewId !== null && (
        <EventDetails
          id={detailViewId}
          onCancel={() => onEventCancel(detailViewId)}
          onEnroll={() => onEventEnroll(detailViewId)}
          onClose={() => {
            setTimeout(() => {
              setDetailViewId(null);
            }, 300);
          }}
        />
      )}
    </div>
  );
};

export default page;
