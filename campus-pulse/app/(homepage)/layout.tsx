"use client";

import type { Metadata } from "next";
import NavigationBar from "@/components/NavigationBar";
import MapSearch from "@/components/icons/MapSearch";
import HomeFilled from "@/components/icons/HomeFilled";
import EventAvailable from "@/components/icons/EventAvailable";
import Person from "@/components/icons/Person";
import { NavigationTabType } from "@/types/types";
import CreateEvent from "@/page_components/create_event/CreateEvent";
import { useState } from "react";

const navigationTabs = [
  {
    id: 0,
    icon: <MapSearch className="h-6!" />,
  },
  {
    id: 1,
    icon: <HomeFilled className="h-6!" />,
  },
  {
    id: 2,
    icon: <EventAvailable className="h-6!" />,
  },
  {
    id: 3,
    icon: <Person />,
  },
] as NavigationTabType[];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [createEventOpen, setCreateEventOpen] = useState<{
    mounted: boolean;
    visible: boolean;
  }>({ mounted: false, visible: false });

  return (
    <main>
      <div className="fixed bottom-0 left-0 pb-3.5">
        <NavigationBar
          options={navigationTabs}
          onOpenCreateEvent={() =>
            setCreateEventOpen({ mounted: true, visible: true })
          }
        />
      </div>
      {createEventOpen.mounted && (
        <CreateEvent
          visible={createEventOpen.visible}
          onClose={() => {
            setCreateEventOpen({ mounted: true, visible: false });
            setTimeout(() => {
              setCreateEventOpen({ mounted: false, visible: false });
            }, 300);
          }}
        />
      )}
      {children}
    </main>
  );
}
