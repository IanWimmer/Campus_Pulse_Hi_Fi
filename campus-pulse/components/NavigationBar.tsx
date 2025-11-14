"use client"

import clsx from 'clsx';


import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';




type NavigationTabType = {
  id: number,
  icon: React.ReactElement,
}


const navigationTabs = [
  {
    id: 0,
    icon: <CalendarMonthIcon />
  },
  {
    id: 1,
    icon: <HomeFilledIcon />
  },
  {
    id: 2,
    icon: <PersonIcon />
  }
] as NavigationTabType[]



const NavigationBarButton = ({
  tabInfo,
  selected = false,
  onClick = () => {},
}: {
  tabInfo: NavigationTabType
  selected?: boolean;
  onClick?: (id?: number) => void;
}) => {

  return <div className='w-[33%] flex justify-center items-center'>
    <button onClick={() => onClick(tabInfo.id)} className={clsx(
      'w-[90%] h-11 rounded-full',
      selected ? 'bg-neutral-300' : 'bg-inherit'
    )}>
      <div>
        {tabInfo.icon}
      </div>
    </button>
  </div>
}



const NavigationBar = () => {
  const [selected, setSelected] = useState<number>(0);



  return <div className="absolute bottom-0 left-0 w-full z-40 h-[60px] bg-neutral-100 flex justify-between">
    {navigationTabs.map(tab => {
      return <NavigationBarButton key={tab.id} tabInfo={tab} selected={selected == tab.id} onClick={() => setSelected(tab.id)}/>
    })}
  </div>
}


export default NavigationBar


