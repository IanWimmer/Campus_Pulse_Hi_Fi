import clsx from "clsx"
import { motion } from "motion/react"





const CrossCheckAnimated = ({
  svgClassName = "",
  check = true,
}: {
  svgClassName?: string,
  check?: boolean
}) => {
  return (<svg className={clsx(svgClassName)} viewBox="0 0 24 24">
    <motion.line
      x1={18}
      x2={11}
      y1={8}
      y2={16}
      className="fill-none stroke-black stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={check ? {x1: 18, x2: 11, y1: 8, y2: 16} : {x1: 16, x2: 8, y1: 8, y2: 16}}
    />
    <motion.line
      x1={11}
      x2={7}
      y1={16}
      y2={12}
      className="fill-none stroke-black stroke-2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={check ? {x1: 11, x2: 7, y1: 16, y2: 12} : {x1: 16, x2: 8, y1: 16, y2: 8}}
    />
  </svg>)
}



export default CrossCheckAnimated