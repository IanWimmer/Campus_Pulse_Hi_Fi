"use client";

import { useEffect, useState } from "react";
import Calendar from "@/components/calendar/Calendar";
import { useLoginContext } from "@/contexts/LoginContext";
import { EventType } from "@/types/types";


export default function CalendarPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const loginContext = useLoginContext();

  // --- Data Fetching ---

  const fetchEvents = async () => {
    // Guard clause if deviceId isn't ready
    if (!loginContext?.state?.deviceId) return;

    try {
      const response = await fetch("/api/events", {
        method: "GET",
        headers: { "X-Device-Id": loginContext.state.deviceId },
      });

      if (response.ok) {
        const data: EventType[] = await response.json();

        // Filter: Keep only events where user is enrolled
        const enrolledEvents = data.filter(event => event.user_enrolled === true);

        setEvents(enrolledEvents);
      } else {
        console.error("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [loginContext?.state?.deviceId]); // Re-run if deviceId changes

  return (
    <div className="min-h-screen pt-10">
      <Calendar events={events} onFetchEvents={fetchEvents} />
    </div>
  );
}