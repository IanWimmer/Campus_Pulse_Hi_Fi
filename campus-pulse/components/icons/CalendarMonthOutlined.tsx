import clsx from "clsx";

const CalendarMonthOutlined = ({
  className = "",
  fill = "transparent",
  stroke = "black",
}: {
  className?: string;
  fill?: string;
  stroke?: string;
}) => {
  return (
    <svg
      className={clsx(className, "h-6 w-5.5")}
      viewBox="0 0 22 24"
      fill="none"
    >
      <g transform="matrix(1,0,0,1,0.919917,1.10985)">
        <g transform="matrix(1.07436,0,0,1,-0.749515,0)">
          <path
            d="M1.74,7.84L18.42,7.84"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[2.3px]"}
          />
        </g>
        <g transform="matrix(1,0,0,1.27681,0,-0.138405)">
          <path
            d="M4.48,2.74L4.48,0.5"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[2.1px]"}
          />
        </g>
        <g transform="matrix(1,0,0,1.27681,0,-0.138405)">
          <path
            d="M15.68,0.5L15.68,2.74"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[2.1px]"}
          />
        </g>
        <path
          d="M1.12,4.56C1.12,4.242 1.247,3.937 1.472,3.712C1.697,3.487 2.002,3.36 2.32,3.36C5.581,3.36 14.579,3.36 17.84,3.36C18.158,3.36 18.464,3.487 18.689,3.712C18.914,3.937 19.04,4.242 19.04,4.56C19.04,7.821 19.04,16.819 19.04,20.08C19.04,20.399 18.914,20.704 18.689,20.929C18.464,21.154 18.158,21.28 17.84,21.28C14.579,21.28 5.581,21.28 2.32,21.28C2.002,21.28 1.697,21.154 1.472,20.929C1.247,20.704 1.12,20.399 1.12,20.08C1.12,16.819 1.12,7.821 1.12,4.56Z"
          className={"stroke-" + stroke + " fill-" + fill + " stroke-[2.4px]"}
        />
        <g transform="matrix(0.98481,0,0,0.967586,-0.514944,0.399352)">
          <ellipse
            cx="6.209"
            cy="12.32"
            rx="0.609"
            ry="0.62"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.2px]"}
          />
        </g>
        <g transform="matrix(0.98481,0,0,0.967586,3.96555,0.399352)">
          <ellipse
            cx="6.209"
            cy="12.32"
            rx="0.609"
            ry="0.62"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.2px]"}
          />
        </g>
        <g transform="matrix(0.98481,0,0,0.967586,8.44505,0.399352)">
          <ellipse
            cx="6.209"
            cy="12.32"
            rx="0.609"
            ry="0.62"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.2px]"}
          />
        </g>
        <g transform="matrix(0.98481,0,0,0.967586,3.96555,4.87885)">
          <ellipse
            cx="6.209"
            cy="12.32"
            rx="0.609"
            ry="0.62"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.2px]"}
          />
        </g>
        <g transform="matrix(0.98481,0,0,0.967586,8.44505,4.87885)">
          <ellipse
            cx="6.209"
            cy="12.32"
            rx="0.609"
            ry="0.62"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.2px]"}
          />
        </g>
        <g transform="matrix(0.98481,0,0,0.967586,-0.514944,4.87885)">
          <ellipse
            cx="6.209"
            cy="12.32"
            rx="0.609"
            ry="0.62"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.2px]"}
          />
        </g>
      </g>
    </svg>
  );
};

export default CalendarMonthOutlined;
