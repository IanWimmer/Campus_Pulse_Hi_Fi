import Card from "@/components/card/Card";
import RightArrow from "@/components/icons/RightArrow";
import { useLoginContext } from "@/contexts/LoginContext";
import { EventType } from "@/types/types";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EditEvent from "../edit_event/EditEvent";

const MyEvents = ({
  onClose = () => {},
  visible = true,
}: {
  onClose?: () => any;
  visible?: boolean;
}) => {
  const [show, setShow] = useState<boolean>(visible);
  const [events, setEvents] = useState<null | EventType[]>(null);
  const [editEvent, setEditEvent] = useState<null | number | string>(null);
  const loginContext = useLoginContext();

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  useEffect(() => {
    fetchEvents();
  }, []);

  function handleCardClick(id: string) {
    setEditEvent(id);
  }

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const fetchEvents = async () => {
    const response = await fetch("/api/events", {
      method: "GET",
      headers: { "X-Device-Id": loginContext.state.deviceId },
    });
    const data = (await response.json()) as EventType[];
    setEvents(data);
  };

  return createPortal(
    <motion.div
      className={clsx(
        "fixed top-0 left-0 w-full h-[calc(var(--vh,1vh)*100)] z-40 pointer-events-auto flex flex-col bg-white overflow-y-scroll"
      )}
      initial={{ x: "100%" }}
      animate={{ x: show ? 0 : "100%" }}
      transition={{ type: "tween", ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="sticky top-0 left-0 h-21 py-2 px-3 shrink-0 bg-white z-43 flex items-end justify-evenly">
        <button
          className="w-8 h-8 flex items-center justify-center"
          onClick={() => handleClose()}
        >
          <RightArrow />
        </button>
        <h1 className="w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
          My Events
        </h1>
        <span className="w-8" />
      </div>

      {/* Main */}
      <div
        className={clsx(
          "absolute top-30 left-0 w-full box-border flex flex-col gap-6 px-7 pb-7"
        )}
      >
        {events?.map((event, index) => {
          if (!event.created_by_user) return;
          const datetime = new Date(event.datetime);
          return (
            <div
              key={index}
              onClick={() => {
                handleCardClick(event.id);
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
                enrollmentAllowed
                onEnroll={async () => {
                  console.log("trying to enroll")
                  await fetch(`api/enrollment/enroll/${event.id}`, {
                    method: "PUT",
                    headers: { "X-Device-Id": loginContext.state.deviceId },
                  });
                  setTimeout(() => {
                    fetchEvents();
                  }, 200);
                }}
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
      </div>

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
    </motion.div>,
    document.body
  );
};

export default MyEvents;
