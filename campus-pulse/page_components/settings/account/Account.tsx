import ArrowBack from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EditRounded } from "@mui/icons-material";
import { useLoginContext } from "@/contexts/LoginContext";
import { UserType } from "@/types/types";
import Spinner from "@/components/icons/Spinner";
import TextInput from "@/components/input_fields/TextInput";
import SecondaryButton from "@/components/buttons/SecondaryButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const Account = ({
  onClose = () => {},
  visible = true,
}: {
  onClose?: () => any;
  visible?: boolean;
}) => {
  const [show, setShow] = useState<boolean>(visible);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [editedUser, setEditedUser] = useState<UserType | null>(null);

  const loginContext = useLoginContext();

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

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const onEditModeEnable = () => {
    setEditMode(true);
    setEditedUser(user);
  };

  const handleUserDataChange = (
    key: keyof UserType,
    value: string | string[]
  ) => {
    setEditedUser((prev) => {
      if (prev === null && user !== null) {
        return { ...user, [key]: value } as UserType;
      }
      if (prev !== null) {
        return { ...prev, [key]: value } as UserType;
      }
      return null;
    });
  };

  const onSubmitEdit = async () => {
    if (user === null || (editedUser !== null && editedUser.name === user.name)) {
      setEditMode(false);
      return
    }

    const formData = new FormData();

    formData.append("data", JSON.stringify(editedUser));

    const res = await fetch("api/user", {
      method: "PUT",
      body: formData,
      headers: { "X-Device-Id": loginContext.state.deviceId },
    });

    setEditMode(false)
    fetchUser()
  };

  const onCancelEdit = async () => {
    setEditMode(false);
    setEditedUser(null);
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
          Account
        </h1>
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => onEditModeEnable()}
        >
          {!editMode && <EditRounded sx={{ fontSize: 28 }} />}
        </button>
      </div>

      {/* Main */}
      {user !== null ? (
        <div
          className={clsx(
            "absolute top-30 left-0 w-full box-border flex flex-col gap-6"
          )}
        >
          {editMode ? (
            <div>
              <div className="px-10.5 flex flex-col gap-3">
                <div>
                  <p className="font-secondary pl-2 text-grayed font-semibold">
                    ID:
                  </p>
                  <div className="font-secondary border-2 border-black bg-zinc-200 h-12 flex items-center p-2 pl-5 text-nowrap overflow-x-hidden">
                    <span className="overflow-x-hidden">{user.id}</span>
                  </div>
                </div>
                <div>
                  <p className="font-secondary pl-2 text-grayed font-semibold">
                    Name:
                  </p>
                  <TextInput
                    value={editedUser?.name}
                    onChange={(event) =>
                      handleUserDataChange("name", event.target.value)
                    }
                  />
                </div>
              </div>
              <div className="fixed bottom-4 left-0 w-screen pl-10.5 pr-9 flex flex-col gap-3">
                <SecondaryButton text={"Cancel"} onClick={() => onCancelEdit()} />
                <PrimaryButton text={"Submit changes"} onClick={() => onSubmitEdit()} />
              </div>
            </div>
          ) : (
            <div className="px-10.5 flex flex-col gap-3">
              <div>
                <p className="font-secondary pl-2 text-grayed font-semibold">
                  ID:
                </p>
                <div className="font-secondary border-2 border-black bg-zinc-200 h-12 flex items-center p-2 pl-5 text-nowrap overflow-x-hidden">
                  <span className="overflow-x-hidden">{user.id}</span>
                </div>
              </div>
              <div>
                <p className="font-secondary pl-2 text-grayed font-semibold">
                  Name:
                </p>
                <div className="font-secondary border-2 border-black bg-zinc-200 h-12 flex items-center p-2 pl-5 text-nowrap overflow-x-hidden">
                  <span className="overflow-x-hidden">{user.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
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
    </motion.div>,
    document.body
  );
};

export default Account;
