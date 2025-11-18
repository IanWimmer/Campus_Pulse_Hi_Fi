import useWindowWidth from "@/custom_hooks/useWindowWidth";





const ProgressionBar = ({
  current_stage,
  n_stages,
}: {
  current_stage: number;
  n_stages: number;
}) => {
  const windowWidth = useWindowWidth() - 50
  const rectWidth = windowWidth / n_stages;
  const viewBoxWidth = windowWidth;
  const viewBoxHeight = 12;

  if (windowWidth === -50) return null;

  return (
    <svg 
      className={"w-[" + windowWidth + "px] h-3"}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      preserveAspectRatio="none"
      role="progressbar"
      aria-valuenow={current_stage}
      aria-valuemin={0}
      aria-valuemax={n_stages}
      aria-label="Progression bar"
    >
      {[...Array(n_stages).keys()].map(i => {
        let fillColor = "fill-neutral-300"
        if (i < current_stage) {fillColor = "fill-neutral-700"}
        else if (i === current_stage) {fillColor = "fill-neutral-400"}

        return (
          <rect 
            key={i}
            x={4 + i * rectWidth}
            y={i === current_stage ? 0 : 3} 
            width={rectWidth ? rectWidth - 12 : 0}
            height={i === current_stage ? 12 : 6}
            rx={i === current_stage ? 6 : 3}
            ry={i === current_stage ? 6 : 3}
            className={fillColor}
          />
        );
      })}
    </svg>
  )
}



export default ProgressionBar