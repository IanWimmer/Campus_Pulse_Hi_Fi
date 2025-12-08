"use client";

import { useEffect, useState } from "react";

import { Carousel } from "@/components/Carousel";

export default function Home() {
  const [cardsData, setCardsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events'); 
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setCardsData(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center gap-0
    bg-[url('/background_patterns/background_pattern_dotted.svg')]
    bg-repeat
    bg-size-[300px_300px]">
      <h1 className="w-full pt-10 text-center content-center text-2xl font-semibold text-white-border">
        What's happening at the moment?
      </h1>

      {loading ? 
        <div className="h-[calc((var(--vh,1vh)*100)-230px)] w-full flex items-center justify-center">
        Loading events...
        </div> :
        <Carousel items={cardsData} height="h-[calc((var(--vh,1vh)*100)-230px)]"/>
      }
    </div>
  );
}
