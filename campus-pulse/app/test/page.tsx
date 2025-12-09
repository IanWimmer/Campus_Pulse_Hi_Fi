"use client";

import PrimaryButton from "@/components/buttons/PrimaryButton";
import Card from "@/components/card/Card";
import { useLoginContext } from "@/contexts/LoginContext";
import EditEvent from "@/page_components/edit_event/EditEvent";
import { EventType } from "@/types/types";
import React, { useEffect, useState } from "react";

const page = () => {
  const [events, setEvents] = useState<null | EventType[]>(null);
  const [editEvent, setEditEvent] = useState<null | number | string>(null);
  const loginContext = useLoginContext();

  const fetchEvents = async () => {
    console.log(loginContext.state.deviceId);
    const response = await fetch("/api/events", {
      method: "GET",
      headers: { "X-Device-Id": loginContext.state.deviceId },
    });
    const data = (await response.json()) as EventType[];
    console.log(data);
    setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  function handleCardClick(id: string) {
    setEditEvent(id);
  }

  if (!events) return <div>waiting</div>;

  return (
    <div className="flex flex-col gap-3 p-2">
      <div>
        <PrimaryButton
          text="Enroll to '0'"
          onClick={() => {
            console.log(
              fetch(`api/enrollment/enroll/0`, {
                method: "PUT",
                headers: { "X-Device-Id": loginContext.state.deviceId },
              })
            );
            setTimeout(() => {
              fetchEvents();
            }, 500);
          }}
        />
      </div>
      {events?.map((event, index) => {
        const datetime = new Date(event.datetime);
        if (event.user_enrolled) console.log("Enrolled in", event.title);
        return (
          <div
            key={index}
            onClick={() => {
              if (!event.user_enrolled) handleCardClick(event.id);
            }}
          >
            <Card
              imageSrc={event.image_path}
              title={event.title}
              datetime={
                datetime.toLocaleDateString("de-CH") +
                ", " +
                datetime.toLocaleTimeString("de-CH", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
              location={event.location}
              enrolled={event.user_enrolled}
              onCancel={async () => {
                await fetch(`api/enrollment/unenroll/${event.id}`, {
                  method: "PUT",
                  headers: { "X-Device-Id": loginContext.state.deviceId },
                });
                setTimeout(() => {
                  fetchEvents();
                }, 200);
              }}
            />
          </div>
        );
      })}
      {editEvent !== null ? (
        <EditEvent
          id={editEvent}
          onClose={() => {
            setTimeout(() => {
              setEditEvent(null);
              fetchEvents();
            }, 300);
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default page;
