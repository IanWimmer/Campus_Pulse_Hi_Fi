import NegativeButton from "@/components/buttons/NegativeButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Chip from "@/components/chip/Chip";
import ProgressBar from "@/components/progress_bar/ProgressBar";
import CheckCircle from "@/components/icons/CheckCircle";
import Map from "@/components/icons/Map";
import RightArrow from "@/components/icons/RightArrow";
import Share from "@/components/icons/Share";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Spinner from "@/components/icons/Spinner";

import { formatEventDateTime } from "@/utils/formatDateTime";

type loadingType = {
  image: boolean;
};

const EventDetails = ({
  visible = true,
  onClose = () => {},
  title = "",
  datetime = "",
  location = "",
  categories = [],
  participants = 0,
  max_participants = 0,
  description = "",
  enrolled = false,
  onEnroll = () => {},
  onCancel = () => {},
}: {
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  datetime?: string;
  location?: string;
  geo_location?: string;
  categories?: string[];
  participants?: number;
  max_participants?: number;
  description?: string | React.ReactNode;
  enrolled?: boolean;
  onEnroll?: () => void;
  onCancel?: () => void;
}) => {
  const [show, setShow] = useState(visible);
  const [loading, setLoading] = useState<loadingType>({
    image: false,
  });

  const [loadingDone, setLoadingDone] = useState<boolean>(false);

  useEffect(() => {
    let stillLoading = false;

    for (const [key, value] of Object.entries(loading)) {
      if (!value) {
        stillLoading = true;
      }
    }

    if (!stillLoading) {
      setLoadingDone(true);
    }
  }, [loading]);

  useEffect(() => {
    if (visible) {
      setShow(true); // Show immediately when visible true
    } else {
      setShow(false);
    }
    // When visible false, keep showing to animate exit
  }, [visible]);

  const handleClose = () => {
    setShow(false); // Start exit animation
    onClose(); // for full animation call onClose after 300ms delay
  };

  return createPortal(
    <motion.div
      className="fixed top-0 left-0 w-screen h-[calc(var(--vh,1vh)*100)] z-40 pointer-events-auto"
      initial={{ x: "100%" }}
      animate={{ x: show ? 0 : "100%" }}
      transition={{ type: "tween", ease: "easeInOut" }}
    >
      {/* loading screen */}
      <div
        role="status"
        className={clsx(
          "absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center",
          visible ? "opacity-100" : "opacity-0",
          loadingDone ? "opacity-0 h-0! w-0!" : "opacity-100"
        )}
      >
        <Spinner />
        <span className="sr-only">Loading...</span>
      </div>

      {/* main part */}
      <div
        className={clsx(
          "absolute top-0 left-0 w-full h-full",
          visible ? "opacity-100" : "opacity-0",
          !loadingDone ? "opacity-0! h-0!" : "opacity-100"
        )}
      >
        {/* Header */}
        <div
          className="absolute top-0 left-0 w-full h-32"
          style={{
            backgroundImage:
              'url("/background_patterns/background_pattern_dotted.svg")',
            backgroundRepeat: "repeat",
            backgroundSize: "300px auto",
            backgroundPositionX: "center",
          }}
        >
          <div className="relative">
            <h1 className="absolute top-12 left-0 w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
              Event details
            </h1>
            <button
              className="absolute top-12 left-3 w-8 h-8 flex items-center justify-center"
              onClick={() => handleClose()}
            >
              <RightArrow />
            </button>
          </div>

          <div className="absolute bottom-0 w-full flex justify-center">
            <div className="w-[355px] flex justify-center mx-6">
              <button className="w-1/2 h-9.5 rounded-tl-[20px] border-b-0 border-l-2 border-t-2 border-r-2 border-black bg-white flex justify-center items-center gap-2 font-semibold">
                <Share />
                Teilen
              </button>
              <button className="w-1/2 h-9.5 rounded-tr-[20px] border-b-0 border-r-2 border-t-2 border-black bg-white flex justify-center items-center gap-2 font-semibold">
                <Map />
                Karte ansehen
              </button>
            </div>
          </div>
        </div>

        {/* Main body */}
        <div className="absolute top-32 border-t-2 border-black h-[calc(100%-128px)] w-full bg-white overflow-y-auto">
          <img
            src={"/images/image_placeholder.jpg"}
            onLoad={() =>
              setLoading((prev) => ({
                ...prev,
                image: true, // update image flag immutably
              }))
            }
            className="max-h-[50%] w-full object-cover flex-1"
          />
          <div className="border-t-2 border-black pt-6 px-6 h-fit">
            <h1 className="font-secondary font-bold text-xl">{title}</h1>
            <div className="font-secondary flex justify-between text-grayed mt-[9px] h-[27px]">
              <p className="flex items-center gap-2">
                {formatEventDateTime(datetime)}
                <CheckCircle className="[&_path]:fill-primary!" />
              </p>
              <p>{location}</p>
            </div>
            <div className="flex gap-1 overflow-x-scroll hide-scrollbar mt-4">
              {categories.map((value, index) => {
                return (
                  <Chip key={value + index} clickable={false} content={value} />
                );
              })}
            </div>
            <div className="mt-5 w-full">
              <ProgressBar
                progress={(participants / max_participants) * 100}
                content={`${participants} / ${max_participants} Participants`}
                className="z-41"
              />
            </div>
            <div className="font-secondary mt-5 pb-20">{description}</div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full p-4 flex">
        {enrolled ? (
          <NegativeButton
            text={"CANCEL ENROLLEMENT"}
            containerClassName="w-full"
            onClick={() => onCancel()}
          />
        ) : (
          <PrimaryButton
            text={"ENROLL ME!"}
            containerClassName="w-full"
            onClick={() => onEnroll()}
          />
        )}
      </div>
    </motion.div>,
    document.body
  );
};

export default EventDetails;
