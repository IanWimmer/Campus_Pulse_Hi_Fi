"use client";

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

import Card from './card/Card';
import { useClickAnimationImmediate } from '@/utils/useClickAnimationImmediate';

interface CarouselProps {
    items: any[];
    height?: string;
}

function getNavButtonClasses(disabled: boolean, clicked: boolean) {
    if (disabled)
      return "bg-zinc-300 border-zinc-400 text-zinc-500 cursor-not-allowed shadow-none translate-x-0 translate-y-0";
  
    if (clicked)
      return "bg-white border-black text-black shadow-[0_0_0_0_rgba(0,0,0,1.00)] translate-x-1.5 translate-y-1.5";
  
    return (
      "bg-white border-black text-black shadow-neobrutalist " +
      "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neobrutalist-hover" +
      "active:translate-x-0 active:translate-y-0 active:shadow-neobrutalist"
    );
  }

export const Carousel = ({ items, height = "h-[500px]" }: CarouselProps) => {
    const [index, setIndex] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const DRAG_BUFFER = 50;
    const GAP_PIXELS = 16;
    const CARD_WIDTH_UNIT = 85;

    useEffect(() => {
        const handleResize = () => {
            const width = window.visualViewport?.width || window.innerWidth;
            setViewportWidth(width);
            const vw = width * 0.01;
            document.documentElement.style.setProperty("--vw", `${vw}px`);
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", handleResize);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    // Debug Logging
    /*useEffect(() => {
        if (!containerRef.current || !cardRef.current || viewportWidth === 0) return;

        const containerW = containerRef.current.offsetWidth;
        const cardW = cardRef.current.offsetWidth;
        const calculatedPercent = (cardW / viewportWidth) * 100;

        console.group("Carousel Debug Metrics");
        console.log(`Viewport Width (JS): ${viewportWidth}px`);
        console.log(`Container Width: ${containerW}px`);
        console.log(`Card Width: ${cardW}px`);
        console.log(`Actual Card vs Viewport: ${calculatedPercent.toFixed(2)}% (Target: ${CARD_WIDTH_UNIT}%)`);
        console.groupEnd();
    }, [viewportWidth, index]);*/

    const handlePrev = () => {
        if (index > 0) setIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (index < items.length - 1) setIndex((prev) => prev + 1);
    };

    const onCardClick = (item: any) => {
        console.log("Clicked " + item.id);
    }

    const {clicked: clickedPrev, handleClick: handleClickPrev} = useClickAnimationImmediate(handlePrev);
    const {clicked: clickedNext, handleClick: handleClickNext} = useClickAnimationImmediate(handleNext);

    const onDragEnd = (event: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -DRAG_BUFFER || velocity < -500) {
            handleNext();
        } else if (offset > DRAG_BUFFER || velocity > 500) {
            handlePrev();
        }
    };

    const cardWidthPx = (viewportWidth * CARD_WIDTH_UNIT) / 100;
    const xOffsetPx = (viewportWidth / 2) - (cardWidthPx / 2) - (index * (cardWidthPx + GAP_PIXELS));

    const canScrollPrev = index > 0;
    const canScrollNext = index < items.length - 1;

    const renderItem = (item: any) => {
        const cardProps = {
            imageSrc: item.image_path,
            title: item.title,
            description: item.description,
            datetime: item.datetime,
            location: item.location,
            tall: true,
            height: "h-full"
        };
        return <Card {...cardProps} />;
    };

    if (!items || items.length === 0) {
        return <div className={clsx("relative w-screen flex items-center justify-center", height)}>No events found</div>;
    }

    return (
        <div
            ref={containerRef}
            className={clsx("relative w-screen overflow-hidden", height)}
            style={{ marginLeft: "calc(50% - (var(--vw, 1vw) * 50))" }}
        >
            {/* TRACK */}
            <motion.div
                className="flex gap-4 items-center h-full py-8 w-full"
                drag="x"
                dragConstraints={{
                    left: canScrollNext ? -Infinity : 0,
                    right: canScrollPrev ? Infinity : 0,
                }}
                dragMomentum={false}
                dragElastic={0.1}
                onDragEnd={onDragEnd}
                animate={{ x: xOffsetPx }}
                transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
                style={{ touchAction: "pan-y" }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        ref={i === 0 ? cardRef : null}
                        className={clsx(
                            "shrink-0 h-full transition-opacity duration-300"
                        )}
                        // STRICT WIDTH ENFORCEMENT
                        style={{
                            width: cardWidthPx > 0 ? cardWidthPx : `${CARD_WIDTH_UNIT}%`
                        }}
                        onClick={() => onCardClick(item)} 
                        animate={{
                            scale: i === index ? 1 : 0.95,
                            opacity: i === index ? 1 : 0.6
                        }}
                    >
                        {renderItem(item)}
                    </motion.div>
                ))}
            </motion.div>

            {/* FLOATING NAVIGATION BUTTONS (Neobrutalist) */}

            {/* PREV BUTTON */}
            <div className="absolute left-2 z-50 top-1/2 -translate-y-1/2">
                <button
                    onClick={handleClickPrev}
                    disabled={index === 0}
                    className={clsx(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 border-2",
                        getNavButtonClasses(index === 0, clickedPrev))}
                    aria-label="Previous card"
                >
                    <ArrowBackIcon className="w-6 h-6" />
                </button>
            </div>

            {/* NEXT BUTTON */}
            <div className="absolute right-2 z-50 top-1/2 -translate-y-1/2">
                <button
                    onClick={handleClickNext}
                    disabled={index === items.length - 1}
                    className={clsx(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 border-2",
                        getNavButtonClasses(index === items.length - 1, clickedNext))}
                    aria-label="Next card"
                >
                    <ArrowForwardIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};