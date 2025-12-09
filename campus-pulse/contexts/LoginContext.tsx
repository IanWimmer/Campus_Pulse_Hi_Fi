"use client";

import { UserType } from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const useDeviceIdForLogin = true;

// Step 1: Create Context
const LoginContext = createContext({
  state: { state: null as boolean | null, deviceId: "" as string },
  actions: (newState: boolean): void => {},
});

// Step 2: Create Provider component
export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [deviceId, setDeviceId] = useState<string>("");

  const key = "campus-pulse-device-id";

  function generateUUID(): string {
    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }

    // Fallback for older browsers
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  const createNewDeviceId = (): string => {
    if (typeof window === "undefined") return "";

    const id = generateUUID();
    window.localStorage.setItem(key, id);

    console.log(id);

    return id;
  };

  const createNewUser = async (id: string) => {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({
        id: id,
        name: id.slice(0, 6),
        enrollments: [],
      } as UserType)
    );
    fetch("api/user/", {
      method: "POST",
      body: formData,
    });
  };

  const getDeviceId = async () => {
    if (typeof window === "undefined") return "";
    let id = window.localStorage.getItem(key);

    if (!id) {
      setLoggedIn(false);
      setDeviceId("");
      return;
    }

    try {
      const res = await fetch("api/user/", {
        method: "GET",
        headers: { "X-Device-Id": id },
      });

      if (!res.ok) {
        console.log(await res.json());
        await createNewUser(id);
      }
    } catch (err) {
      console.error("Error while fetching user", err);
    }

    setLoggedIn(true);

    setDeviceId(id);
  };

  const createAsyncDeviceId = async () => {
    const id = await createNewDeviceId();
    createNewUser(id);
    setDeviceId(id);
  };

  useEffect(() => {
    getDeviceId();
  }, []);

  return (
    <LoginContext.Provider
      value={{
        state: {
          state: loggedIn,
          deviceId: deviceId,
        },
        actions: (newState: boolean) => {
          setLoggedIn(newState);
          if (newState) {
            createAsyncDeviceId();
          }
        },
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

// Step 3: Create the custom hook to use this context
export function useLoginContext() {
  return useContext(LoginContext);
}
