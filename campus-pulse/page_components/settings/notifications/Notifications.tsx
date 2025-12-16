import Chip from "@/components/chip/Chip";
import DropDownMenu from "@/components/dropdown/DropDownMenu";
import Spinner from "@/components/icons/Spinner";
import { CheckboxInput } from "@/components/input_fields/CheckboxInput";
import Switch from "@/components/switch/Switch";
import { EditOffRounded, EditRounded } from "@mui/icons-material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type CategorySettingsType = {
  enabled: boolean;
  freq: "rare" | "common" | "often";
};

type FrequencySettingsType = {
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  night: boolean;
};

type NotificationSettingsType = {
  overall: boolean;
  pn: CategorySettingsType;
  cs: CategorySettingsType;
  g: CategorySettingsType;
  s: CategorySettingsType;
  freq: FrequencySettingsType;
  limit: string;
};

const dropDownMenuLimitOptions = [
  { label: "> 6 / day", value: ">6/week" },
  { label: "1 / day", value: "1/day" },
  { label: "2 / day", value: "2/day" },
  { label: "3 / day", value: "3/day" },
  { label: "4 / day", value: "4/day" },
  { label: "5 / day", value: "5/day" },
  { label: "6 / day", value: "6/day" },
  { label: "1 / week", value: "1/week" },
  { label: "2 / week", value: "2/week" },
  { label: "3 / week", value: "3/week" },
  { label: "4 / week", value: "4/week" },
  { label: "5 / week", value: "5/week" },
  { label: "6 / week", value: "6/week" },
];

const MAENFrequencyBar = () => {
  return (
    <svg
      className="w-full"
      height="41"
      viewBox="0 0 345 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="13" y1="35" x2="334" y2="35" stroke="#D9D9D9" strokeWidth="4" />
      <circle cx="226" cy="35" r="6" fill="#D9D9D9" />
      <circle cx="119" cy="35" r="6" fill="#D9D9D9" />
      <circle
        cx="6"
        cy="6"
        r="6"
        transform="matrix(1 0 0 -1 6 41)"
        fill="#D9D9D9"
      />
      <circle
        cx="6"
        cy="6"
        r="6"
        transform="matrix(1 0 0 -1 327 41)"
        fill="#D9D9D9"
      />
      <path
        d="M12 2V10M12 2L8 6M12 2L16 6M4.93 10.93L6.34 12.34M2 18H4M20 18H22M19.07 10.93L17.66 12.34M22 22H2M16 18C16 16.9391 15.5786 15.9217 14.8284 15.1716C14.0783 14.4214 13.0609 14 12 14C10.9391 14 9.92172 14.4214 9.17157 15.1716C8.42143 15.9217 8 16.9391 8 18"
        stroke="#5D5D5D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M119 2V4M119 20V22M111.93 4.93L113.34 6.34M124.66 17.66L126.07 19.07M109 12H111M127 12H129M113.34 17.66L111.93 19.07M126.07 4.93L124.66 6.34M123 12C123 14.2091 121.209 16 119 16C116.791 16 115 14.2091 115 12C115 9.79086 116.791 8 119 8C121.209 8 123 9.79086 123 12Z"
        stroke="#5D5D5D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M226 10V2M226 10L230 6M226 10L222 6M218.93 10.93L220.34 12.34M216 18H218M234 18H236M233.07 10.93L231.66 12.34M236 22H216M230 18C230 16.9391 229.579 15.9217 228.828 15.1716C228.078 14.4214 227.061 14 226 14C224.939 14 223.922 14.4214 223.172 15.1716C222.421 15.9217 222 16.9391 222 18"
        stroke="#5D5D5D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M341.985 14.4859C341.891 16.2221 341.297 17.8939 340.273 19.2993C339.249 20.7047 337.841 21.7836 336.217 22.4054C334.593 23.0273 332.824 23.1655 331.124 22.8034C329.423 22.4414 327.864 21.5944 326.634 20.3651C325.405 19.1357 324.558 17.5765 324.196 15.876C323.833 14.1755 323.971 12.4065 324.593 10.7827C325.215 9.159 326.293 7.7501 327.699 6.72635C329.104 5.70259 330.776 5.10782 332.512 5.01391C332.917 4.99191 333.129 5.47391 332.914 5.81691C332.195 6.96746 331.887 8.32778 332.04 9.67586C332.194 11.0239 332.8 12.2802 333.759 13.2396C334.719 14.199 335.975 14.8049 337.323 14.9584C338.671 15.1119 340.031 14.804 341.182 14.0849C341.526 13.8699 342.007 14.0809 341.985 14.4859Z"
        stroke="#5D5D5D"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Notifications = ({
  onClose = () => {},
  visible = true,
}: {
  onClose?: () => any;
  visible?: boolean;
}) => {
  const [show, setShow] = useState<boolean>(visible);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [notificationSettings, setNotificationSettings] =
    useState<null | NotificationSettingsType>(null);

  const key = "campus-pulse-notifications";

  const updateLocalStorage = (
    new_preferences: NotificationSettingsType | null
  ) => {
    if (typeof window === "undefined") return;

    if (new_preferences === null) {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(new_preferences));
  };

  const getLocalStorage = (): NotificationSettingsType => {
    if (typeof window === "undefined")
      return {
        overall: true,
        pn: { enabled: true, freq: "common" },
        cs: { enabled: true, freq: "common" },
        g: { enabled: true, freq: "common" },
        s: { enabled: true, freq: "common" },
        freq: { morning: true, afternoon: true, evening: true, night: true },
        limit: "2/day",
      };

    const data_json = window.localStorage.getItem(key);

    if (data_json === null) {
      return {
        overall: true,
        pn: { enabled: true, freq: "common" },
        cs: { enabled: true, freq: "common" },
        g: { enabled: true, freq: "common" },
        s: { enabled: true, freq: "common" },
        freq: { morning: true, afternoon: true, evening: true, night: true },
        limit: "2/day",
      };
    }

    return JSON.parse(data_json);
  };

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    setNotificationSettings(getLocalStorage());
  }, []);

  const handleClose = () => {
    updateLocalStorage(notificationSettings);
    setShow(false);
    onClose();
  };

  const handleChange = (
    key: keyof NotificationSettingsType,
    value: string | boolean | CategorySettingsType | FrequencySettingsType
  ) => {
    setNotificationSettings((prev) => {
      const base = prev ?? {
        overall: true,
        pn: { enabled: true, freq: "common" },
        cs: { enabled: true, freq: "common" },
        g: { enabled: true, freq: "common" },
        s: { enabled: true, freq: "common" },
        freq: { morning: true, afternoon: true, evening: true, night: true },
        limit: "2/day",
      };

      const next: NotificationSettingsType = {
        ...base,
        [key]: value,
      };

      updateLocalStorage(next);
      return next;
    });
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
          Notifications
        </h1>
        <span className="w-8" />
      </div>

      {/* Main */}
      <div
        className={clsx(
          "absolute top-30 left-0 w-full box-border flex flex-col gap-6 px-10.5"
        )}
      >
        {notificationSettings !== null ? (
          <>
            <div>
              <div className="flex gap-4 items-center justify-center">
                <span>off</span>
                <Switch
                  initialState={notificationSettings.overall}
                  onSwitch={(new_state) => handleChange("overall", new_state)}
                />
                <span>on</span>
              </div>
              <div className="pt-6">
                <h2 className="font-secondary text-xl text-center">
                  Notifications are{" "}
                  {notificationSettings.overall ? "active" : "inactive"}
                </h2>
                <p className="font-secondary text-grayed text-center text-base/5 mt-3">
                  {notificationSettings.overall ? (
                    <>
                      You currently receive about <br /> 3 notifications per day
                    </>
                  ) : (
                    <>
                      You currently receive no <br /> notifications
                    </>
                  )}
                </p>
              </div>

              <div className="mt-8">
                <h2 className="font-secondary text-xl font-semibold">
                  Frequency
                </h2>
                <div>
                  <p className="font-secondary mt-2">
                    I would like to receive notifications during the...
                  </p>
                  <div className="mt-4">
                    <MAENFrequencyBar />
                    <div className="flex justify-between pt-2">
                      <CheckboxInput
                        name={"morning"}
                        value={"morning"}
                        bgSwitching
                        onChange={() => {
                          handleChange("freq", {
                            ...notificationSettings.freq,
                            morning: !notificationSettings.freq.morning,
                          });
                        }}
                        checked={notificationSettings.freq.morning}
                      />
                      <CheckboxInput
                        name={"afternoon"}
                        value={"afternoon"}
                        bgSwitching
                        onChange={() => {
                          handleChange("freq", {
                            ...notificationSettings.freq,
                            afternoon: !notificationSettings.freq.afternoon,
                          });
                        }}
                        checked={notificationSettings.freq.afternoon}
                      />
                      <CheckboxInput
                        name={"evening"}
                        value={"evening"}
                        bgSwitching
                        onChange={() => {
                          handleChange("freq", {
                            ...notificationSettings.freq,
                            evening: !notificationSettings.freq.evening,
                          });
                        }}
                        checked={notificationSettings.freq.evening}
                      />
                      <CheckboxInput
                        name={"night"}
                        value={"night"}
                        bgSwitching
                        onChange={() => {
                          handleChange("freq", {
                            ...notificationSettings.freq,
                            night: !notificationSettings.freq.night,
                          });
                        }}
                        checked={notificationSettings.freq.night}
                      />
                    </div>
                  </div>
                  <div className="mt-8">
                    <p className="font-secondary">Maximum limit</p>
                    <DropDownMenu
                      options={dropDownMenuLimitOptions}
                      initialValue={notificationSettings.limit}
                      onChange={(new_selection) =>
                        handleChange(
                          "limit",
                          Array.isArray(new_selection)
                            ? new_selection[0]
                            : new_selection
                        )
                      }
                    />
                  </div>
                </div>
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

export default Notifications;
