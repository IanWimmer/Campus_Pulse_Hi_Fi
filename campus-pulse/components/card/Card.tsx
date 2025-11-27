import clsx from "clsx";
import NegativeButton from "../buttons/NegativeButton";

const Card = ({
  imageSrc = "images/image_placeholder.jpg",
  title = null,
  description = null,
  datetime = null,
  location = null,
  tall = false,
  height = null,
  enrolled = false,
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
  onCancel?: () => void;
}) => {
  if (height === null && tall) height = "h-112";
  else if (height === null && !tall) height = "h-64";

  return (
    <div
      className={clsx(
        "shadow-neobrutalist border-2 border-black flex flex-col bg-white",
        height
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
        {(datetime || location) && (
          <div className="text-grayed font-secondary text-sm">
            <div className="">
              {datetime && <div>{datetime}</div>}
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
      {enrolled && <div className="h-18 flex justify-evenly items-center border-t-2 border-black">
        <p className=" font-semibold text-primary h-12 text-center content-center">
          ENROLLED
        </p>
        <div className="w-fit text-xl">
          <NegativeButton text={"CANCEL"} containerClassName="[&_button]:px-4" onClick={() => onCancel()} />
        </div>
      </div>}
    </div>
  );
};

export default Card;
