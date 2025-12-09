"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import CrossOutlined from "@/components/icons/CrossOutlined";
import Search from "@/components/icons/Search";
import DateTimeRangeInput from "@/components/input_fields/DateTimeRangeInput";
import LocationInput from "@/components/input_fields/LocationInput";
import TextInput from "@/components/input_fields/TextInput";
import { useSearchVersionContext } from "@/contexts/SearchVersionContext";
import { DateTimeRange, UserType } from "@/types/types";
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
import { createPortal } from "react-dom";

const page = () => {
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  const [friendsOpen, setFriendsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userSearchSelection, setUserSearchSelection] = useState<UserType[]>(
    []
  );

  const [categoriesFocused, setCategoriesFocused] = useState<boolean>(false);
  const [categorySearchSelection, setCategorySearchSelection] = useState<
    string[]
  >([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [buildingInput, setBuildingInput] = useState<string | null>(null);
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

    const fetchUsers = async () => {
      const res = await fetch("api/user/all");

      if (!res.ok) {
        console.error("Failed to fetch users");
        return;
      }

      const users = (await res.json()) as UserType[];
      setUsers(users);
      setUserSearchSelection((prev) => {
        return prev.length > 0 ? prev : users;
      });
    };

    fetchCategories();
    fetchUsers();
  }, []);

  const TrivialSearchLayout = (
    <>
      <TextInput
        withEndIcon
        endIcon={<Search />}
        onChange={(event) => setSearchInput(event.target.value)}
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
            <div className="w-1/2 flex items-center h-9">
              <TextInput
                className="h-9! shadow-neobrutalist-sm! pl-1.5!"
                withStartIcon
                startIcon={<LocationOnOutlined />}
                startIconBorderDisabled
                placeholder="Building"
                onChange={(event) => setBuildingInput(event.target.value)}
              />
            </div>
            <div className="w-1/2">
              <DateTimeRangeInput
                className="h-9!"
                onChange={(range) => setDateTimeRange(range)}
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
                      key={"selection-" + index}
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
              />
            </div>
            <div className="w-[calc(50%-4px)]">
              <DropDownMenu
                className="h-9! shadow-neobrutalist-sm! p-0!"
                disableChevronCircle
                options={[
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
          />
        </div>
      </div>

      {/* Row 3 */}
      <div className="flex w-full items-center gap-2">
        <div className="w-1/2 flex items-center h-9">
          <TextInput
            className="h-9! shadow-neobrutalist-sm! pl-1.5!"
            withStartIcon
            startIcon={<LocationOnOutlined />}
            startIconBorderDisabled
            placeholder="Building"
            onChange={(event) => setBuildingInput(event.target.value)}
          />
        </div>
        <div className="w-1/2">
          <DateTimeRangeInput
            className="h-9!"
            onChange={(range) => setDateTimeRange(range)}
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
            "px-1.5 font-secondary flex gap-1 flex-wrap overflow-y-scroll h-full",
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

  return (
    <div className="flex w-screen h-[calc(var(--vh)*100-64px)] flex-col items-center gap-0 z-10">
      <div className="absolute top-16 w-full px-7">
        {/* Filters */}
        {searchVersionContext.state
          ? OptimizedSearchLayout
          : TrivialSearchLayout}

        <div className="w-full mt-6 -mr-2">
          <PrimaryButton text={"SEARCH"} containerClassName="pr-0!" />
        </div>
      </div>

      {/* Categories */}
      {categoriesFocused ? CategoriesOverlay : ""}

      {/* Friends */}
      {friendsOpen ? FriendsOverlay : ""}
    </div>
  );
};

export default page;
