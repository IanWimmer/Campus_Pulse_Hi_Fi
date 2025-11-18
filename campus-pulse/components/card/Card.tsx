



const Card = ({
  imageSrc = "images/image_placeholder.png",
  title = null,
  description = null,
  datetime = null,
  location = null,
  height = "h-64"
}: {
  imageSrc?: string;
  title?: string | null;
  description?: string | null;
  datetime?: string | null;
  location?: string | null;
  height?: string | number;
}) => {
  return (<div className={"rounded-2xl shadow-[0px_0px_5px_5px_rgba(0,0,0,0.25)] relative"}>
    <div className={"rounded-2xl overflow-hidden relative " + height}>
      <img src={imageSrc} className="h-full w-full object-cover"/>
    </div>
    <div className="absolute bg-[#EBEBEB] rounded-xl bottom-0 left-0 m-2 p-3">
      <h3 className="font-semibold text-xl mb-2">
        {title}
      </h3>
      <p className="text-sm">
        {description}
      </p>
    </div>

  </div>)
}



export default Card