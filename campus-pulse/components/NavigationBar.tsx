"use client"


import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PersonIcon from '@mui/icons-material/Person';




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

  return <div>
    <button onClick={() => onClick(tabInfo.id)}>
      {tabInfo.icon}
    </button>
  </div>
}



const NavigationBar = () => {
  return <div className="absolute bottom-0 left-0 w-full z-40 h-[60px] bg-neutral-100 flex justify-between">
    {navigationTabs.map(tab => {
      return <NavigationBarButton tabInfo={tab} />
    })}
  </div>
}


export default NavigationBar


