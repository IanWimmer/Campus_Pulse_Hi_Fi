import clsx from "clsx";

const RightArrow = ({
  className = "",
  fill = "black",
}: {
  className?: string;
  fill?: string;
}) => {
  return (
    <svg
      className={clsx(className, "h-[22px] w-[22px] aspect-square")}
      viewBox="0 0 22 22"
      fill="none"
    >
      <line
        x1={20}
        x2={2}
        y1={11}
        y2={11}
        stroke={fill}
        strokeWidth={3}
        strokeLinecap="round"
        className={"fill-" + fill}
      />
      <line
        x1={11}
        x2={2}
        y1={2}
        y2={11}
        stroke={fill}
        strokeWidth={3}
        strokeLinecap="round"
        className={"fill-" + fill}
      />
      <line
        x1={11}
        x2={2}
        y1={20}
        y2={11}
        stroke={fill}
        strokeWidth={3}
        strokeLinecap="round"
        className={"fill-" + fill}
      />
    </svg>
  );
};

export default RightArrow;
