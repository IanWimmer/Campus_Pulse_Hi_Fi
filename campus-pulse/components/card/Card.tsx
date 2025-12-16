import clsx from "clsx";
import NegativeButton from "../buttons/NegativeButton";

import { formatEventDateTime } from "@/utils/formatDateTime";
import PrimaryButton from "../buttons/PrimaryButton";
import { showPopup } from "@/utils/GlobalPopupManager";

const Card = ({
  imageSrc = "images/image_placeholder.jpg",
  title = null,
  description = null,
  datetime = null,
  location = null,
  tall = false,
  height = null,
  enrolled = false,
  enrollmentAllowed = false,
  enrollmentDisabled = false,
  onEnroll = () => {},
  onCancel = () => {},
}: {
  imageSrc?: string;
  title?: string | null;
  description?: string | null;
  datetime?: string | null;
  location?: string | null;
  tall?: boolean;
  height?: string | number | null;
  enrolled?: boolean;
  enrollmentAllowed?: boolean;
  enrollmentDisabled?: boolean;
  onEnroll?: () => any;
  onCancel?: () => any;
}) => {
  let heightClass = height;
  if (height === null && tall) heightClass = "h-112";
  else if (height === null && !tall) heightClass = "h-64";

  const formattedDatetime = datetime ? formatEventDateTime(datetime) : null;

  return (
    <div
      className={clsx(
        "border-2 border-black flex flex-col bg-white transition-all duration-200",
        "shadow-neobrutalist hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neobrutalist-hover",
        heightClass
      )}
    >
      <div className="h-3 bg-white border-b-2 border-b-black shrink-0" />
      <div className={"overflow-hidden border-b-2 border-b-black flex-1"}>
        <img src={imageSrc} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 bg-white shrink-0 h-fit w-full grid grid-cols-1">
        {title && (
          <h3 className="font-secondary font-bold text-base">{title}</h3>
        )}
        {(formattedDatetime || location) && (
          <div className="text-grayed font-secondary text-sm">
            <div className="">
              {formattedDatetime && <div>{formattedDatetime}</div>}
              {location && <div>{location}</div>}
            </div>
          </div>
        )}
        {description && (
          <p className="font-secondary text-sm max-h-12 text-black overflow-y-hidden mt-2">
            {description}
          </p>
        )}
      </div>
      {enrolled && (
        <div className="h-16 flex justify-evenly pt-1.25 border-t-2 border-black">
          <p className="pt-1 font-semibold text-primary h-12 text-center content-center">
            ENROLLED
          </p>
          <div className="w-fit text-xl">
            <NegativeButton
              stopPropagation
              text={"CANCEL"}
              containerClassName="[&_button]:px-4"
              onClick={() => {
                showPopup({
                  title: "Enrollment canceled",
                  description: `Your enrollement to ${title} was canceled`,
                  ttl: 4000,
                });
                onCancel();
              }}
            />
          </div>
        </div>
      )}
      {enrollmentAllowed && !enrolled && (
        <div className="h-16 flex justify-evenly pt-1.25 border-t-2 border-black w-full">
          <div className="w-full text-xl px-2">
            <PrimaryButton
              stopPropagation
              text={"ENROLL"}
              onClick={() => {
                showPopup({ title: "Enrollment successful", description: `You're now enrolled to ${title}`, ttl: 4000 });
                onEnroll();
              }}
              disabled={enrollmentDisabled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
