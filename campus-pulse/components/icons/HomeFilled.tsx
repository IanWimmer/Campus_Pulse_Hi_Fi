import clsx from "clsx";

const HomeFilled = ({
  className = "",
  fill = "black",
}: {
  className?: string;
  fill?: string;
}) => {
  return (
    <svg className={clsx(className, "h-8 w-8")} viewBox="0 0 22 24" fill="none">
      <path
        d="M0 24V8L10.6667 0L21.3333 8V24H13.3333V14.6667H8V24H0Z"
        className={"fill-" + fill}
      />
    </svg>
  );
};

export default HomeFilled;
