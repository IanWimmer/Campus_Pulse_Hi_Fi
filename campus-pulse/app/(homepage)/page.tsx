"use client";

import { useEffect, useState } from "react";

import { Carousel } from "@/components/Carousel";
import LoadingPageOverlay from "@/components/loading_page_overlay/LoadingPageOverlay";
import clsx from "clsx";
import { useLoginContext } from "@/contexts/LoginContext";
import { EventType } from "@/types/types";

export default function Home() {
  const [cardsData, setCardsData] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const loginContext = useLoginContext();

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events", {
        method: "GET",
        headers: { "X-Device-Id": loginContext.state.deviceId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = (await response.json()) as EventType[];
      // console.log(data)
      setCardsData(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div
      className={clsx(
        "flex min-h-[calc(var(--vh,1vh)*100)] flex-col items-center gap-0",
        "bg-[url('/background_patterns/background_pattern_dotted.svg')]",
        "bg-repeat",
        "bg-size-[300px_300px]"
      )}
    >
      <h1 className="w-full pt-10 text-center content-center text-2xl font-semibold text-white-border">
        What's happening at
        <br /> the moment?
      </h1>

      {loading && <LoadingPageOverlay />}
      {!loading && (
        <Carousel
          items={cardsData}
          onFetchEvents={() => {
            // console.log("fetching events");
            fetchEvents();
          }}
          height="h-[calc((var(--vh,1vh)*100)-230px)]"
        />
      )}
    </div>
  );
}
