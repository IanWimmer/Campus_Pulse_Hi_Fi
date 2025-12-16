"use client";

import { InfoOutlineRounded } from "@mui/icons-material";
import clsx from "clsx";
import { motion } from "motion/react";
import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import CrossOutlined from "@/components/icons/CrossOutlined";

// Global state (NO HOOKS at module level)
type PopupProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  ttl?: number;
  onClose?: () => void;
};

declare global {
  interface Window {
    __popupQueue: PopupProps[];
    __popupContainer: HTMLDivElement | null;
  }
}

const popupQueue: PopupProps[] = [];
if (typeof window !== "undefined") {
  window.__popupQueue = popupQueue;
  if (!window.__popupContainer) {
    window.__popupContainer = document.createElement("div");
    window.__popupContainer.id = "global-popup-container";
    window.__popupContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1px;
      height: 1px;
      pointer-events: none;
      z-index: 99999;
    `;
    document.body.appendChild(window.__popupContainer);
  }
}

// ✅ API: Use this anywhere
export const showPopup = ({title = "", description = "", icon = <InfoOutlineRounded sx={{ fontSize: "40px" }} />, ttl = -1, onClose = () => {}}: Omit<PopupProps, "id">) => {
  const props = {title: title, description: description, icon: icon, ttl: ttl, onClose: onClose} as Omit<PopupProps, "id">
  const id = `popup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const popup: PopupProps = { id, ...props };
  
  popupQueue.unshift(popup); // Newest on top
  
  // Limit to 5 popups
  if (popupQueue.length > 5) {
    popupQueue.length = 5;
  }
  
  return {
    id,
    dismiss: () => {
      const index = popupQueue.findIndex(p => p.id === id);
      if (index > -1) popupQueue.splice(index, 1);
    }
  };
};

// ✅ PopupRenderer Component (with Hooks)
const PopupRenderer = () => {
  const [activePopups, setActivePopups] = useState<PopupProps[]>([]);

  useEffect(() => {
    const syncQueue = () => {
      if (window.__popupQueue) {
        setActivePopups([...window.__popupQueue]);
      }
    };

    syncQueue();
    const interval = setInterval(syncQueue, 50); // Responsive sync
    
    return () => clearInterval(interval);
  }, []);

  const removePopup = useCallback((id: string) => {
    if (window.__popupQueue) {
      const index = window.__popupQueue.findIndex(p => p.id === id);
      if (index > -1) window.__popupQueue.splice(index, 1);
    }
  }, []);

  if (!activePopups.length) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-99999 flex flex-col-reverse p-4 gap-2 max-h-screen overflow-hidden">
      {activePopups.map((popup, index) => (
        <PopupInner
          key={popup.id}
          {...popup}
          onClose={() => removePopup(popup.id)}
          index={activePopups.length - 1 - index}
        />
      ))}
    </div>,
    window.__popupContainer!
  );
};

// Internal popup component
const PopupInner = ({
  title,
  description,
  icon,
  ttl = -1,
  onClose,
  index,
}: PopupProps & { index: number }) => {
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useState<number>(Date.now())[0];

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  useEffect(() => {
    if (ttl > -1) {
      const duration = ttl;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const remainingPercent = Math.max(0, ((duration - elapsed) / duration) * 100);
        setProgress(remainingPercent);
        
        if (elapsed < duration && !closing) {
          requestAnimationFrame(animate);
        } else if (elapsed >= duration) {
          handleClose();
        }
      };
      
      requestAnimationFrame(animate);
      
      return () => {}; // Cleanup not needed for RAF
    }
  }, [ttl, handleClose, closing]);

  const showProgress = ttl > -1 && !closing;

  return (
    <motion.div
      className={clsx("absolute top-0 left-0 w-full pointer-events-auto p-2", index > 0 && "mt-2")}
      initial={{ translateY: "-112px", opacity: 0 }}
      animate={{ translateY: closing ? "-112px" : "0", opacity: closing ? 0 : 1 }}
      exit={{ translateY: "-112px", opacity: 0 }}
      transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
    >
      <div className="w-full h-20 border-2 border-black bg-primary-background rounded-md shadow-neobrutalist-sm flex items-center relative overflow-hidden">
        {showProgress && (
          <motion.div
            className="absolute h-full top-0 left-0 bg-[rgba(0,0,0,15%)]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: ttl! / 1000 - 0.3, delay: 0.3, ease: "linear" }}
          />
        )}
        
        <div className="flex items-center justify-center h-full aspect-square shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-secondary text-[18px]/6 font-semibold w-full overflow-hidden text-ellipsis">
            {title}
          </div>
          <div className="text-sm/4 font-secondary text-gray-500 overflow-hidden text-ellipsis">
            {description}
          </div>
        </div>
        <div
          className="h-full aspect-square shrink-0 flex items-center justify-center transition-all"
          onClick={handleClose}
        >
          <CrossOutlined className="h-4! w-4!" stroke="stroke-gray-500" />
        </div>
      </div>
    </motion.div>
  );
};

// ✅ Export the component to render
export default PopupRenderer;
