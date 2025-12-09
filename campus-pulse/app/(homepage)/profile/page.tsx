"use client";

import QRCodeButton from "@/components/buttons/QrCodeButton";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import QRCode from "@/components/icons/QRCode";
import RightArrow from "@/components/icons/RightArrow";
import LoadingPageOverlay from "@/components/loading_page_overlay/LoadingPageOverlay";
import { useLoginContext } from "@/contexts/LoginContext";
import AddFriends from "@/page_components/add_friends/AddFriends";
import MyEvents from "@/page_components/my_events/MyEvents";
import Settings from "@/page_components/settings/Settings";
import { UserType } from "@/types/types";
import { PersonOutline } from "@mui/icons-material";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";

const AddFriendsContainer = ({
  visible = true,
  onClose = () => {},
}: {
  visible?: boolean;
  onClose?: () => any;
}) => {
  const handleClose = () => {
    setShow(false); // Start exit animation
    onClose(); // for full animation call onClose after 300ms delay
  };
  const [show, setShow] = useState(visible);

  return (
    <motion.div
      className={clsx(
        "fixed top-0 left-0 w-full h-[calc(var(--vh,1vh)*100)] z-50 pointer-events-auto flex flex-col bg-white overflow-y-scroll pb-8"
      )}
      initial={{ x: "100%" }}
      animate={{ x: show ? 0 : "100%" }}
      transition={{ type: "tween", ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="sticky top-0 left-0 h-21 py-2 px-3 mb-2 shrink-0 bg-white z-43 flex items-end justify-evenly">
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => handleClose()}
        >
          <RightArrow />
        </button>
        <h1 className="w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
          Friends
        </h1>
        <span className="w-8" />
      </div>

      {/* Main */}
      <AddFriends />
    </motion.div>
  );
};

const page = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const loginContext = useLoginContext();

  const [myEventsOpen, setMyEventsOpen] = useState<boolean>(false)
  const [friendsOpen, setFriendsOpen] = useState<boolean>(false)
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("api/user", {
        method: "GET",
        headers: { "X-Device-Id": loginContext.state.deviceId },
      });

      if (!res.ok) {
        console.log("Something went wrong");
        return;
      }

      const data = (await res.json()) as UserType;

      setUser(data);
    };

    fetchUser();
  }, []);

  if (user === null) {
    return <LoadingPageOverlay />;
  }

  return (
    <div className="absolute top-0 left-0 max-h-[calc(var(--vh,1vh)*100-64px)] w-full">
      <div className="flex flex-col items-center pt-18">
        <div className="border-black border-2 shadow-neobrutalist w-40 h-40 rounded-full flex items-center justify-center">
          <PersonOutline sx={{ fontSize: 128 }} />
        </div>
        <h1 className="text-2xl font-semibold pt-8">{user.name}</h1>
        <p className="font-secondary justify-center items-center h-5 flex text-grayed mt-2">
          nethz username: {user.name}{" "}
          <span className="pl-2">
            <QRCodeButton />
          </span>
        </p>
      </div>
      <div className="absolute top-90 px-11 font-secondary">
        <h2 className="font-bold text-xl">Email address</h2>
        <p className="text-grayed">{user.name}@student.ethz.ch</p>
      </div>
      <div className="absolute top-111 flex flex-col gap-4 w-full px-10.5">
        <SecondaryButton text={"MY EVENTS"} onClick={() => setMyEventsOpen(true)} />
        <SecondaryButton text={"FRIENDS"} onClick={() => setFriendsOpen(true)} />
        <SecondaryButton text={"SETTINGS"} onClick={() => setSettingsOpen(true)} />
      </div>

      {myEventsOpen && <MyEvents onClose={() => {
        setTimeout(() => {
          setMyEventsOpen(false)
        }, 300)
      }} />}

      {friendsOpen && <AddFriendsContainer onClose={() => {
        setTimeout(() => {
          setFriendsOpen(false)
        }, 300)
      }} />}

      {settingsOpen && <Settings onClose={() => {
        setTimeout(() => {
          setSettingsOpen(false)
        }, 300)
      }} />}
    </div>

    
  );
};

export default page;
