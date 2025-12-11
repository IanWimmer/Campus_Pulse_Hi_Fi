import SecondaryButton from "@/components/buttons/SecondaryButton";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Spinner from "@/components/icons/Spinner";
import Switch from "@/components/switch/Switch";
import { useSearchVersionContext } from "@/contexts/SearchVersionContext";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Settings = ({
  onClose = () => {},
  visible = true,
}: {
  onClose?: () => any;
  visible?: boolean;
}) => {
  const [show, setShow] = useState<boolean>(visible);

  const searchVersionContext = useSearchVersionContext();

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const handleClose = () => {
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
          <ArrowBack fontSize="large"/>
        </button>
        <h1 className="w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
          Settings
        </h1>
        <span className="w-8" />
      </div>

      {/* Main */}
      <div
        className={clsx(
          "absolute top-30 left-0 w-full box-border flex flex-col gap-6"
        )}
      >
        <div className="w-full px-10.5 flex flex-col">
          <p className="font-secondary font-semibold text-grayed pl-2">
            Account
          </p>
          <div className="w-full flex flex-col gap-3">
            <SecondaryButton text={"ACCOUNT"} />
          </div>
        </div>
        <div className="w-full px-10.5 flex flex-col">
          <p className="font-secondary font-semibold text-grayed pl-2">
            Content & Notifications
          </p>
          <div className="w-full flex flex-col gap-3">
            <SecondaryButton text={"EVENT PREFERENCES"} />
            <SecondaryButton text={"NOTIFICATIONS"} />
          </div>
        </div>
        <div className="w-full px-10.5 flex flex-col">
          <p className="font-secondary font-semibold text-grayed pl-2">
            Others
          </p>
          <div className="w-full flex flex-col gap-3">
            <div className="w-full flex justify-between items-center mr-2 px-2">
              <p className="font-secondary">Optimised Search Layout</p>
              {searchVersionContext.state === null ? (
                <Spinner className="h-8! w-8!" />
              ) : (
                <Switch
                  initialState={searchVersionContext.state}
                  onSwitch={(new_state) =>
                    searchVersionContext.actions(new_state)
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>,
    document.body
  );
};

export default Settings;
