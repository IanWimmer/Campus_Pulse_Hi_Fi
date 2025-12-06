"use client";

import NavigationBar from "@/components/NavigationBar";
import { NavigationTabType } from "@/types/types";
import CreateEvent from "@/page_components/create_event/CreateEvent";
import { useState } from "react";

import Map from "@mui/icons-material/Map";
import Search from "@mui/icons-material/Search";
import HomeFilled from "@mui/icons-material/HomeFilled";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Person from "@mui/icons-material/Person";

const navigationTabs = [
  {
    id: 0,
    icon: <Map sx={{ fontSize: 28 }}/>,
  },
  {
    id: 1,
    icon: <Search sx={{ fontSize: 28 }}/>
  },
  {
    id: 2,
    icon: <HomeFilled sx={{ fontSize: 28 }}/>,
  },
  {
    id: 3,
    icon: <EventAvailable sx={{ fontSize: 28 }}/>,
  },
  {
    id: 4,
    icon: <Person sx={{ fontSize: 28 }}/>,
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
