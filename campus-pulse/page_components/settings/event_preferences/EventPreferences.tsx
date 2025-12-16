import Chip from "@/components/chip/Chip";
import Spinner from "@/components/icons/Spinner";
import { EditOffRounded, EditRounded } from "@mui/icons-material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const preferenceNames = {
  pn: ["WG party", "Club", "Bar", "Rooftop", "Karaoke", "Rave"],
  cs: ["Einstein", "Mensa", "Picnic", "Chinawiese", "Movie night", "Walk"],
  g: [
    "Boardgames",
    "Werewolf",
    "Billiard",
    "Card games",
    "Video games",
    "Quiz",
  ],
  s: ["Table tennis", "Gym", "Jogging", "Volleyball", "Football", "Yoga"],
};

type PreferencesBooleanType = {
  pn: boolean[];
  cs: boolean[];
  g: boolean[];
  s: boolean[];
};

const EventPreferences = ({
  onClose = () => {},
  visible = true,
}: {
  onClose?: () => any;
  visible?: boolean;
}) => {
  const [show, setShow] = useState<boolean>(visible);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [preferencesBoolean, setPreferencesBoolean] =
    useState<null | PreferencesBooleanType>(null);

  const key = "campus-pulse-preferences";

  const updateLocalStorage = (
    new_preferences: PreferencesBooleanType | null
  ) => {
    if (typeof window === "undefined") return;

    if (new_preferences === null) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(new_preferences));
  };

  const getLocalStorage = (): PreferencesBooleanType => {
    if (typeof window === "undefined")
      return {
        pn: Array(6).fill(false),
        cs: Array(6).fill(false),
        g: Array(6).fill(false),
        s: Array(6).fill(false),
      };

    const data_json = window.localStorage.getItem(key);

    if (data_json === null) {
      return {
        pn: Array(6).fill(false),
        cs: Array(6).fill(false),
        g: Array(6).fill(false),
        s: Array(6).fill(false),
      };
    }

    return JSON.parse(data_json);
  };

  const handleChipClick = (
    category: keyof PreferencesBooleanType,
    index: number
  ) => {
    setPreferencesBoolean((prev) => {
      const base = prev ?? {
        pn: Array(6).fill(false),
        cs: Array(6).fill(false),
        g: Array(6).fill(false),
        s: Array(6).fill(false),
      };

      const next: PreferencesBooleanType = {
        ...base,
        [category]: [...base[category]],
      };

      next[category][index] = !next[category][index];

      updateLocalStorage(next);
      return next;
    });
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    setPreferencesBoolean(getLocalStorage());
  }, []);

  const handleClose = () => {
    updateLocalStorage(preferencesBoolean);
    setShow(false);
    onClose();
  };

  return createPortal(
    <motion.div
      className={clsx(
        "fixed top-0 left-0 w-full h-[calc(var(--vh,1vh)*100)] z-40 pointer-events-auto flex flex-col bg-white overflow-y-scroll"
      )}
      initial={{ x: "100%" }}
      animate={{ x: show ? 0 : "100%" }}
      transition={{ type: "tween", ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="sticky top-0 left-0 h-21 py-2 px-3 shrink-0 bg-white z-43 flex items-end justify-evenly">
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => handleClose()}
        >
          <ArrowBack fontSize="large" />
        </button>
        <h1 className="w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
          Event Preferences
        </h1>
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? (
            <EditOffRounded sx={{ fontSize: 28 }} />
          ) : (
            <EditRounded sx={{ fontSize: 28 }} />
          )}
        </button>
      </div>

      {/* Main */}
      <div
        className={clsx(
          "absolute top-30 left-0 w-full box-border flex flex-col gap-6 px-10.5"
        )}
      >
        {preferencesBoolean !== null ? (
          <>
            <div>
              <h2 className="font-secondary text-xl font-semibold">
                🎉 Party & nightlife
              </h2>
              <div className="flex flex-wrap w-full gap-2 mt-2">
                {preferenceNames.pn.map((value, index) => {
                  return (
                    <Chip
                      key={"pn-" + index}
                      content={value}
                      clickable={editMode}
                      onClick={() => handleChipClick("pn", index)}
                      initialState={preferencesBoolean.pn[index]}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <h2 className="font-secondary text-xl font-semibold">
                ☕ Chill & social
              </h2>
              <div className="flex flex-wrap w-full gap-2 mt-2">
                {preferenceNames.cs.map((value, index) => {
                  return (
                    <Chip
                      key={"cs-" + index}
                      content={value}
                      clickable={editMode}
                      onClick={() => handleChipClick("cs", index)}
                      initialState={preferencesBoolean.cs[index]}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <h2 className="font-secondary text-xl font-semibold">
                🎲 Games
              </h2>
              <div className="flex flex-wrap w-full gap-2 mt-2">
                {preferenceNames.g.map((value, index) => {
                  return (
                    <Chip
                      key={"g-" + index}
                      content={value}
                      clickable={editMode}
                      onClick={() => handleChipClick("g", index)}
                      initialState={preferencesBoolean.g[index]}
                    />
                  );
                })}
              </div>
            </div>
            <div>
              <h2 className="font-secondary text-xl font-semibold">
                🏃 Sports
              </h2>
              <div className="flex flex-wrap w-full gap-2 mt-2">
                {preferenceNames.s.map((value, index) => {
                  return (
                    <Chip
                      key={"s-" + index}
                      content={value}
                      clickable={editMode}
                      onClick={() => handleChipClick("s", index)}
                      initialState={preferencesBoolean.s[index]}
                    />
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div
            role="status"
            className={clsx(
              "fixed top-0 left-0 w-screen h-full bg-white flex items-center justify-center"
            )}
          >
            {/* loading screen */}
            <Spinner />
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </motion.div>,
    document.body
  );
};

export default EventPreferences;
