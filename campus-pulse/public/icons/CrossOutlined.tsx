import clsx from "clsx";

const CrossOutlined = ({
  className = "",
  fill = "transparent",
  stroke = "stroke-black",
}: {
  className?: string;
  fill?: string;
  stroke?: string;
}) => {
  return (
    <svg
      className={clsx(className, "h-6 w-6")}
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M1 11L11 1M1 1L11 11"
        strokeLinecap="round"
        className={clsx("fill-" + fill, "stroke-2", stroke)}
      />
    </svg>
  );
};

export default CrossOutlined;
