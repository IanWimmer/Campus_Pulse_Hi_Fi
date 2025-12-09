"use client";

import Calendar, {CalendarEvent} from "@/components/calendar/Calendar";

const EVENTS: CalendarEvent[] = [
    {
        "id": 0,
        "title": "Spontaneous Boardgame Night",
        "datetime": "2025-12-16T20:13:20.000Z"
      },
      {
        "id": 1,
        "title": "Flash Coffee Chat",
        "datetime": "2025-12-16T12:30:20.000Z",
      },
      {
        "id": 2,
        "title": "Speed Portrait Sketches",
        "datetime": "2025-12-17T14:00:20.000Z",
      },
      {
        "id": 3,
        "title": "Indoor Scavenger Hunt",
        "datetime": "2025-12-17T16:12:20.000Z",
      },
      {
        "id": 4,
        "title": "Weekly Trivia Blitz",
        "datetime": "2025-12-17T19:00:20.000Z",
      },
      {
        "id": 8,
        "title": "Mini Terrarium Build",
        "datetime": "2025-12-22T16:47:20.000Z",
      },
      {
        "id": 11,
        "title": "Park Clean-up & Chat",
        "datetime": "2025-12-20T11:20:20.000Z",
      },
];

export default function CalendarPage() {
    return (
        <div className="min-h-screen pt-10">
            <Calendar events={EVENTS}/>
        </div>
    );
}