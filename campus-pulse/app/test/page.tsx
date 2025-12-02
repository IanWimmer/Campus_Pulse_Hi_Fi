"use client";

import Card from "@/components/card/Card";
import DateTimeInput from "@/components/input_fields/DateTimeInput";
import { EventType } from "@/types/types";
import React, { useEffect, useState } from "react";

const page = () => {
  const [events, setEvents] = useState<null | EventType[]>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data = (await response.json()) as EventType[];
      setEvents(data);
    };

    fetchEvents();
  }, []);

  if (!events) return <div>waiting</div>;

  return (
    <div className="flex flex-col gap-3 p-2">
      {events?.map((event, index) => {
        const datetime = new Date(event.datetime)
        return (
          <Card
            key={index}
            imageSrc={event.image_path}
            title={event.title}
            datetime={datetime.toLocaleDateString("de-CH") + ", " + datetime.toLocaleTimeString("de-CH", {hour: "2-digit", minute: "2-digit"})}
            location={event.location}
          />
        );
      })}
    </div>
  );
};

export default page;
