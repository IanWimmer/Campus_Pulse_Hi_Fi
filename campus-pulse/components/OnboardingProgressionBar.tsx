import useWindowWidth from "@/custom_hooks/useWindowWidth";
import clsx from "clsx";
import { motion } from "motion/react";





const OnboardingProgressionBar = ({
  current_stage,
  n_stages,
  time_per_page = [],
}: {
  current_stage: number;
  n_stages: number;
  time_per_page?: number[]; // just for animation in seconds, empty list: no timer, value = -1: no timer for this specific portion
}) => {
  const windowWidth = useWindowWidth() - 50
  const rectWidth = windowWidth / n_stages;
  const viewBoxWidth = windowWidth;
  const viewBoxHeight = 16;

  if (windowWidth === -50) return null;

  if (time_per_page.length !== n_stages && time_per_page.length !== 0) {
    throw new Error("Length of time_per_page list does not match n_stages, but it should")
  }


  if (time_per_page.length === 0) {
    time_per_page = Array(n_stages).fill(-1)
  }

  return (
    <svg 
      className={clsx("w-[" + windowWidth + "px] h-4", "drop-shadow-[4px_4px_0px_rgba(0,0,0,1.00)]")}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      role="progressbar"
      aria-valuenow={current_stage}
      aria-valuemin={0}
      aria-valuemax={n_stages}
      aria-label="Progression bar"
    >
      {[...Array(n_stages).keys()].map(i => {
        let fillColor = "fill-white"
        if (i < current_stage) {fillColor = "fill-primary"}
        else if (i === current_stage) {fillColor = "fill-primary-background"}

        return (
          <g key={i}>
          {time_per_page[i] != -1 && i == current_stage ? <rect 
            key={"background-" + i}
            x={4 + i * rectWidth}
            y={i === current_stage ? 2 : 4} 
            width={rectWidth ? rectWidth - 12 : 0}
            height={i === current_stage ? 12 : 8}
            rx={i === current_stage ? 6 : 4}
            ry={i === current_stage ? 6 : 4}
            className={clsx(fillColor)}
          /> : ""}
          {i == current_stage && time_per_page[i] != -1 ? <motion.rect 
            key={"animated-" + i}
            x={4 + i * rectWidth}
            y={i === current_stage ? 3 : 4} 
            height={i === current_stage ? 10 : 8}
            rx={i === current_stage ? 5 : 4}
            ry={i === current_stage ? 5 : 4}
            initial={{width: 0}}
            animate={{width: rectWidth - 12}}
            transition={{duration: time_per_page[i] === -1 ? 0 : time_per_page[i], ease: "linear"}}
            className={clsx("fill-primary")}
          /> : ""}
          <rect 
            key={i}
            x={4 + i * rectWidth}
            y={i === current_stage ? 2 : 4} 
            width={rectWidth ? rectWidth - 12 : 0}
            height={i === current_stage ? 12 : 8}
            rx={i === current_stage ? 6 : 4}
            ry={i === current_stage ? 6 : 4}
            className={clsx(time_per_page[i] != -1 && i == current_stage ? "fill-transparent" : fillColor, "stroke-2 stroke-black")}
          />
          </g>
        );
      })}
    </svg>
  )
}



export default OnboardingProgressionBar