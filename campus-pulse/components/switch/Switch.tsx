"use client"

import clsx from "clsx"
import { useEffect, useState } from "react"
import CrossCheckAnimated from "../icons/CrossCheckAnimated"
import { motion } from "motion/react"




const Switch = ({
  onSwitch = (newState) => {},
  initialState = false
}: {
  onSwitch?: (new_state: boolean) => void,
  initialState?: boolean
}) => {
  const [switched, setSwitched] = useState<boolean>(initialState)

  useEffect(() => {
    onSwitch(switched)
  }, [switched])

  return (<label className="flex items-center h-fit w-fit">
    <button onClick={() => setSwitched(!switched)} className={clsx("h-9 w-18 rounded-full border-2 border-black relative shadow-neobrutalist-xs transition-colors", switched ? "bg-primary-background" : "bg-transparent")}>
      <motion.div 
        className={clsx("w-6 h-6 relative box-border border-2 flex justify-center items-center border-black rounded-full bg-white")}
        animate={{left: switched ? 40 : 4}}
      >
        <CrossCheckAnimated check={switched}/>
      </motion.div>
    </button>
  </label>)
}



export default Switch