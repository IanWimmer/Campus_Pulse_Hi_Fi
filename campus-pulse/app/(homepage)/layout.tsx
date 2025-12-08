"use client";

import NavigationBar from "@/components/NavigationBar";
import { NavigationTabType } from "@/types/types";
import CreateEvent from "@/page_components/create_event/CreateEvent";
import { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import Map from "@mui/icons-material/Map";
import Search from "@mui/icons-material/Search";
import HomeFilled from "@mui/icons-material/HomeFilled";
import EventAvailable from "@mui/icons-material/EventAvailable";
import Person from "@mui/icons-material/Person";

const ICON_FONT_SIZE: number = 28;

const NAVIGATION_TABS = [
  { id: 0, icon: <Map sx={{ fontSize: ICON_FONT_SIZE }} /> },
  { id: 1, icon: <Search sx={{ fontSize: ICON_FONT_SIZE }} /> },
  { id: 2, icon: <HomeFilled sx={{ fontSize: ICON_FONT_SIZE }} /> },
  { id: 3, icon: <EventAvailable sx={{ fontSize: ICON_FONT_SIZE }} /> },
  { id: 4, icon: <Person sx={{ fontSize: ICON_FONT_SIZE }} /> },
] as NavigationTabType[];

const TAB_ROUTES: Record<number, string> = {
  0: "/map",
  1: "/search",
  2: "/", // Home
  3: "/calendar",
  4: "/profile",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [createEventOpen, setCreateEventOpen] = useState<{
    mounted: boolean;
    visible: boolean;
  }>({ mounted: false, visible: false });

  const pathname = usePathname();
  const router = useRouter();

  const activeTabId = useMemo(() => {
    // Find which ID matches the current path
    const foundId = Object.keys(TAB_ROUTES).find(
      (key) => TAB_ROUTES[Number(key)] === pathname
    );
    // Return found ID or default to 2 (Home) if on root or unknown
    return foundId ? Number(foundId) : 2;
  }, [pathname]);

  const handleTabChange = (id: number) => {
    const route = TAB_ROUTES[id];
    if (route) {
      router.push(route);
    }
  };

  return (
    <main>
      <div className="fixed bottom-0 left-0 pb-3.5 z-30">
        <NavigationBar
          options={NAVIGATION_TABS}
          selected={activeTabId}
          onChange={handleTabChange}
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
