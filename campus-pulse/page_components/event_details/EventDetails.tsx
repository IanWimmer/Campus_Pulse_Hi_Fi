import NegativeButton from "@/components/buttons/NegativeButton";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import Chip from "@/components/chip/Chip";
import ProgressBar from "@/components/progress_bar/ProgressBar";
import CheckCircle from "@/public/icons/CheckCircle";
import Map from "@/public/icons/Map";
import RightArrow from "@/public/icons/RightArrow";
import Share from "@/public/icons/Share";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type loadingType = {
  image: boolean;
};

const EventDetails = ({
  visible = true,
  onClose = () => {},
  title = "",
  time = "",
  location = "",
  geo_location = "",
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
  time?: string;
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
        <svg
          aria-hidden="true"
          className="w-12 h-12 text-neutral-tertiary animate-spin fill-brand"
          viewBox="0 0 100 101"
          fill="none"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            className="fill-primary-background"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            className="fill-primary"
          />
        </svg>
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
                {time}
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
