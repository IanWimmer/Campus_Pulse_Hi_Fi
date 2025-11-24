import { ChangeEvent, useRef, useState } from "react"


const RadioButtonInputForm = ({
  name,
  onChange = (event) => {},
  options,
  initialValue = "",
}: {
  name: string,
  options: {label: string | React.ReactNode, value: string}[],
  onChange?: (event: ChangeEvent) => any,
  initialValue?: string
}) => {
  const [selected, setSelected] = useState<string>(initialValue)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value)
    onChange(event)
  }

  return (<div className="flex flex-col gap-1">
    {options.map((v, i) => {
      return (
        <RadioButtonInput 
          name={name} 
          value={v.value} 
          label={v.label} 
          id={name + i} 
          key={name + i} 
          checked={selected === v.value}
          onChange={(event) => handleChange(event)}
        />
      )
    })}
  </div>)
}


export const RadioButtonInput = ({
  name,
  value,
  onChange = (event) => {},
  id = 0,
  label = "",
  checked = false,
}: {
  name: string,
  value: string,
  onChange?: (event: ChangeEvent<HTMLInputElement>) => any,
  id?: any,
  label?: string | React.ReactNode
  checked?: boolean
}) => {
  const inputId = id?.toString() || `${name}-${value}`;
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <label 
      htmlFor={inputId}
      className={"h-8 flex items-center gap-3 cursor-pointer"}
    >
      <input 
        ref={inputRef}
        type="radio"
        id={inputId}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <svg className="h-full aspect-square" viewBox="0 0 33 33">
        <circle cx={16} cy={16} r={16} className="fill-primary-background" />
        <circle cx={16} cy={16} r={12} className="fill-transparent stroke-2 stroke-black" />
        {checked && <circle cx={16} cy={16} r={7} className="fill-black" />}
      </svg>
      {label && <div>{label}</div>}
    </label>
  )
}



export default RadioButtonInputForm