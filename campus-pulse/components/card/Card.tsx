import clsx from "clsx";

const Card = ({
  imageSrc = "images/image_placeholder.png",
  title = null,
  description = null,
  datetime = null,
  location = null,
  tall = false,
  height = null,
}: {
  imageSrc?: string;
  title?: string | null;
  description?: string | null;
  datetime?: string | null;
  location?: string | null;
  tall?: boolean
  height?: string | number | null;
}) => {
  if (height === null && tall) height = "h-112";
  else if (height === null && !tall) height = "h-64";

  
  return (<div className={clsx("shadow-neobrutalist border-2 border-black flex flex-col", height)}>
    <div className="h-3 bg-white border-b-2 border-b-black shrink-0"/>
    <div className={"overflow-hidden border-b-2 border-b-black flex-1"}>
      <img src={imageSrc} className="h-full w-full object-cover"/>
    </div>
    <div className="p-3 bg-white shrink-0 h-fit w-full grid grid-cols-1 gap-2">
      {title && <h3 className="font-secondary font-bold text-base">
        {title}
      </h3>}
      {description && <p className="font-secondary text-xs max-h-12 overflow-y-hidden">
        {description}
      </p>}
      {(datetime || location) && <div className="text-zinc-500 font-secondary">
        {datetime && <div>
          {datetime}
        </div>}
        {location && <div>
          {location}
        </div>}
      </div>}
    </div>
  </div>)
}



export default Card