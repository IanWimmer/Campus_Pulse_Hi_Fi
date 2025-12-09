import clsx from "clsx";

const QRCode = ({
  className = "",
  fill = "black",
}: {
  className?: string;
  fill?: string;
}) => {
  return (
    <svg 
      className={clsx(className, "h-4 w-4")} 
      viewBox="0 0 16 16" 
      fill="none"
    >
      <path
        d="M0 7V0H7V7H0ZM1.75 5.25H5.25V1.75H1.75V5.25ZM0 15.75V8.75H7V15.75H0ZM1.75 14H5.25V10.5H1.75V14ZM8.75 7V0H15.75V7H8.75ZM10.5 5.25H14V1.75H10.5V5.25ZM14 15.75V14H15.75V15.75H14ZM8.75 10.5V8.75H10.5V10.5H8.75ZM10.5 12.25V10.5H12.25V12.25H10.5ZM8.75 14V12.25H10.5V14H8.75ZM10.5 15.75V14H12.25V15.75H10.5ZM12.25 14V12.25H14V14H12.25ZM12.25 10.5V8.75H14V10.5H12.25ZM14 12.25V10.5H15.75V12.25H14Z"
      className={"fill-" + fill}
      />
    </svg>
  );
};

export default QRCode;
