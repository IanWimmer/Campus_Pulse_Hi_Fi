import clsx from "clsx";

const LocationSearch = ({
  className = "",
  fill = "transparent",
  stroke = "black",
}: {
  className?: string;
  fill?: string;
  stroke?: string
}) => {
  return (
    <svg
      className={clsx(className, "h-8 w-5.5")}
      viewBox="0 0 22 32"
      style={{
        fillRule: "evenodd",
        clipRule: "evenodd",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeMiterlimit: 1.5,
      }}
    >
      <g transform="matrix(1,0,0,1,3.55271e-15,1)">
        <g transform="matrix(1.8625,0,0,1.81543,-11,-9.65704)">
          <path
            d="M14.765,16.943C13.983,18.33 12.982,19.768 11.812,21.294C8.857,17.441 6.98,14.144 6.98,10.828C6.98,8.092 9.145,5.87 11.812,5.87C14.479,5.87 16.644,8.092 16.644,10.828C16.644,11.411 16.586,11.995 16.474,12.58"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[1.3px]"}
          />
        </g>
        <g transform="matrix(1,0,0,1,-4.5,-6.5)">
          <g transform="matrix(1,0,0,1,2.5,4)">
            <circle
              cx="13"
              cy="12.5"
              r="4.5"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[2.4px]"}
            />
          </g>
          <path
            d="M18.681,19.681L24,25"
            className={"stroke-" + stroke + " fill-" + fill + " stroke-[2.4px]"}
          />
        </g>
      </g>
    </svg>
  );
};

export default LocationSearch;
