"use client";

import { useState, useMemo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CalendarTop } from "@/public/background_patterns/CalendarTop";


export interface CalendarEvent {
    id: number;
    title: string;
    datetime: string; // ISO string
  }
  
  interface CalendarProps {
    events?: CalendarEvent[];
  }

// --- 2. Main Calendar Component ---
export default function Calendar({ events = [] }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week">("month");

  // Navigation Logic
  const handlePrevClick = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNextClick = () => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  // Date Calculation Helper
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const gridCells = [];

    if (view === 'month') {
      // --- MONTH VIEW LOGIC ---
      const firstDayOfMonth = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      let startDayOfWeek = firstDayOfMonth.getDay();
      startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; // Mon=0 ... Sun=6

      // Prev Month Padding
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month, 0 - i);
        gridCells.push({ date, day: date.getDate(), currentMonth: false });
      }
      // Current Month
      for (let i = 1; i <= daysInMonth; i++) {
        gridCells.push({ date: new Date(year, month, i), day: i, currentMonth: true });
      }
      // Next Month Padding
      const totalDaysSoFar = gridCells.length;
      const totalCells = totalDaysSoFar <= 35 ? 35 : 42;
      for (let i = 1; i <= totalCells - totalDaysSoFar; i++) {
        gridCells.push({ date: new Date(year, month + 1, i), day: i, currentMonth: false });
      }

    } else {
      // --- WEEK VIEW LOGIC ---
      // Find the Monday of the current week
      const currentDay = currentDate.getDay(); // 0=Sun, 1=Mon...
      // Calculate how many days to subtract to get back to Monday (if Sun(0), subtract 6. If Mon(1), subtract 0)
      const daysToSubtract = currentDay === 0 ? 6 : currentDay - 1; 
      
      const mondayDate = new Date(year, month, currentDate.getDate() - daysToSubtract);

      for (let i = 0; i < 7; i++) {
        const date = new Date(mondayDate);
        date.setDate(mondayDate.getDate() + i);
        gridCells.push({
          date: date,
          day: date.getDate(),
          // Determine if the day shown belongs to the currently viewed month header
          currentMonth: date.getMonth() === month 
        });
      }
    }

    return gridCells;
  }, [currentDate, view]);

  // Headers
  const weekDaysLetters = ["M", "T", "W", "T", "F", "S", "S"];
  // In week view, the header still shows the month of the selected date
  const monthName = currentDate.toLocaleString("en", { month: "long" }).toUpperCase();
  const year = currentDate.getFullYear();
  
  // Helper for month view grid sizing
  const isSixRows = view === 'month' && calendarData.length > 35;

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[368px] mx-auto px-[5px] box-border">
      <div className="relative w-full [&>svg]:w-full [&>svg]:h-auto flex justify-center">
        <CalendarTop />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center pt-21 text-white">
          
          {/* Month Navigation Row */}
          <div className="flex items-center justify-between w-full px-6 mb-1">
            <button onClick={handlePrevClick} className="rounded-full p-1 transition">
              <ArrowBackIcon style={{ fontSize: 28 }} />
            </button>
            
            <h2 className="text-xl font-semibold tracking-wide">
              {monthName} {year}
            </h2>

            <button onClick={handleNextClick} className="rounded-full p-1 transition">
              <ArrowForwardIcon style={{ fontSize: 28 }} />
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border-[#BC5231] rounded overflow-hidden">
             <button 
               onClick={() => setView('month')}
               className={`px-3 py-1 text-sm font-secondary transition-colors ${view === 'month' ? 'bg-[#BC5231]' : 'bg-transparent text-white/70'}`}
             >
               month
             </button>
             <div className="w-px h-4 bg-white"></div>
             <button 
                onClick={() => setView('week')}
                className={`px-3 py-1 text-sm font-secondary transition-colors ${view === 'week' ? 'bg-[#BC5231]' : 'bg-transparent text-white/70'}`}
             >
               week
             </button>
          </div>

        </div>
      </div>

      {/* --- Bottom Grid Section --- */}
      {/* Note: margin-top -2px pulls it up to connect seamlessly with the SVG bottom */}
      <div className={`w-full bg-white border-2 border-black -mt-0.5 z-10 shadow-neobrutalist h-[calc((var(--vh,1vh)*100)-360px)] flex ${view === 'week' ? 'flex-row' : 'flex-col'}`}>
        
        {/* 1. Weekday Letters Header/Sidebar */}
        <div className={`${view === 'month' ? 'grid grid-cols-7 border-b border-black w-full shrink-0' : 'flex flex-col border-r border-black shrink-0'}`}>
           {weekDaysLetters.map((d, i) => (
             <div key={i} className={`text-center font-bold text-black flex items-center justify-center ${view === 'month' ? 'py-1' : 'flex-1 w-8 border-b border-black last:border-b-0'}`}>
               {d}
             </div>
           ))}
        </div>


        {/* 2. The Main Data Area (Month Grid OR Week Rows) */}
        <div className={`flex-1 min-h-0 min-w-0 ${view === 'month' ? `grid grid-cols-7 ${isSixRows ? 'grid-rows-6' : 'grid-rows-5'}` : 'flex flex-col divide-y divide-black'}`}>
            {calendarData.map((cell, index) => {
              // Filter and sort events for this date cell
              const dayEvents = events
                .filter(e => {
                  const eventDate = new Date(e.datetime);
                  return eventDate.getDate() === cell.date.getDate() &&
                         eventDate.getMonth() === cell.date.getMonth() &&
                         eventDate.getFullYear() === cell.date.getFullYear();
                })
                .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());

              // --- Cell Wrapper Styling based on View ---
              const cellClasses = view === 'month' 
              ? `
                  border-b border-r border-black last:border-r-0 
                  ${(index + 1) % 7 === 0 ? 'border-r-0' : ''} 
                  ${index >= (isSixRows ? 35 : 28) ? 'border-b-0' : ''} 
                  p-1 relative flex flex-col h-full overflow-hidden
                `
              : `
                 /* Week view row styling */
                 flex-1 flex flex-col p-1 pl-2 relative overflow-hidden min-h-0
                `;

              return (
                <div key={index} className={cellClasses}>
                  
                  {/* Day Number Indicator */}
                  <span className={`text-sm font-bold leading-none mb-1 ${cell.currentMonth ? 'text-black' : 'text-gray-400'}`}>
                    {cell.day}
                  </span>

                  {/* Events Container */}
                  <div className="flex-1 flex flex-col overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {dayEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="cursor-pointer group"
                        onClick={() => console.log("Clicked event:", event.title)}
                      >
                        {/* --- Event Item Styling based on View --- */}
                        {view === 'month' ? (
                          // Month View: Two lines (Time over Title)
                          <div className="mb-2">
                             <div className="flex items-center gap-1 mb-px">
                                <div className="w-2 h-2 rounded-full bg-[#1FAA1F] shrink-0"></div>
                                <span className="text-[10px] font-bold text-[#1FAA1F] leading-none font-secondary">
                                  {formatTime(event.datetime)}
                                </span>
                              </div>
                              <div className="text-[10px] text-black leading-tight truncate w-full pl-0.5 font-secondary">
                                {event.title}
                              </div>
                          </div>
                        ) : (
                          // Week View: One line (Dot, Time, Title)
                          <div className="flex items-center text-xs gap-2 mb-1 w-full">
                             <div className="w-2 h-2 rounded-full bg-[#1FAA1F] shrink-0"></div>
                             <span className="font-bold text-[#1FAA1F] leading-none shrink-0 font-secondary">
                                {formatTime(event.datetime)}
                             </span>
                             <span className="text-black leading-tight truncate font-secondary">
                                {event.title}
                             </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}