"use client"


import { ChevronLeftOutlined } from "@mui/icons-material"
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"




const DropDownItem = ({
  content = "",
  value = null,
  selected = false,
  onClick = () => {}
}: {
  content?: string | React.ReactNode,
  value?: null | string,
  selected?: boolean,
  onClick?: (value: string) => void,
}) => {


  return (<div className={clsx(
    "hover:bg-neutral-200 h-8 rounded-md flex items-center pl-2",
    selected && "bg-primary-background font-medium"
  )} onClick={() => onClick(value ? value : "")} >
    {content}
  </div>)
}




// onChange will only pass on the newly selected option
const DropDownMenu = ({
  onChange = (newSelection: string) => {},
  options = [],
  initialValue = "",
  withoutShadow = false,
  placeholder = "",
  withPlaceholder = true,
}: {
  onChange?: (newSelection: string) => void
  options?: {label: (string | React.ReactNode), value: string}[],
  initialValue?: string,
  withoutShadow?: boolean,
  placeholder?: string,
  withPlaceholder?: boolean,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>(initialValue)
  
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownButtonRef = useRef<HTMLDivElement>(null)


  const handleOpenChange = () => {
    setIsOpen(!isOpen)
  }

  const handleSelection = (value: string) => {
    setSelected(value);
    setIsOpen(false);
  }


  useEffect(() => {
    const handler = (event: MouseEvent) => {
      console.log(event)
      if (dropdownRef.current && event.target instanceof Node && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      document.addEventListener("click", handler)

      return () => {
        document.removeEventListener("click", handler)
      }
    }
  }, [dropdownRef])


  useEffect(() => {
    onChange(selected)
  }, [selected])

  return (<div ref={dropdownRef}>
    <div 
      className={clsx("flex w-full h-12 items-center justify-between border-2 border-black p-2 pl-5", !withoutShadow && "shadow-neobrutalist")} 
      onClick={handleOpenChange}
      ref={dropdownButtonRef}
    >
      {selected === "" ? (withPlaceholder ? placeholder : "") : options.find((ele) => ele.value === selected)?.label}
      <div className="h-8 w-8 border-2 border-black rounded-full flex items-center justify-center">
        <ChevronLeftOutlined sx={{ transform: isOpen ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
      </div>
    </div>

    <div className={clsx(
        "absolute max-h-[40vh] p-2 mt-2 bg-white shadow-neobrutalist-xs border-2 border-black flex flex-col gap-0.5 overflow-y-scroll",
        isOpen ? "opactiy-100 h-fit" : "opacity-0 h-0",
      )} 
      style={{width: isOpen ? dropdownButtonRef?.current?.offsetWidth : 0}}
    >
      {options.map((ele, index) => (<DropDownItem key={ele.value + index} content={ele.label} selected={ele.value == selected} value={ele.value} onClick={handleSelection} />))}
    </div>

    <div className={clsx("absolute top-0 left-0", isOpen ? "h-screen w-screen" : "h-0 w-0")}></div>
  </div>)
}




export default DropDownMenu