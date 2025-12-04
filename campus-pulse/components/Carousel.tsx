import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { motion, useMotionValue, animate } from "framer-motion";

import Card from './card/Card';

interface CarouselProps {
    items: any[]; // Array of data objects for the cards
    height?: string; // Adjustable height for the whole carousel
}

export const Carousel = ({ items, height = "h-[500px]" }: CarouselProps) => {
    const [index, setIndex] = useState(0);

    // Debug State
    const containerRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Configuration
    const DRAG_BUFFER = 50;
    const GAP_PIXELS = 16;

    // We use 85, representing 85 "units" of our custom viewport width
    const CARD_WIDTH_UNIT = 85;

    // Measure widths for debugging (Console Only)
    useEffect(() => {
        const updateMeasurements = () => {
            if (containerRef.current && cardRef.current) {
                const containerW = containerRef.current.offsetWidth;
                const cardW = cardRef.current.offsetWidth;

                // We use window.innerWidth here to verify if it matches the viewport logic
                const viewportW = window.innerWidth;
                const calculatedPercent = (cardW / viewportW) * 100;

                console.group("Carousel Debug Metrics");
                console.log(`Viewport Width: ${viewportW}px`);
                console.log(`Container Width: ${containerW}px`);
                console.log(`Card Width: ${cardW}px`);
                console.log(`Actual Card vs Viewport: ${calculatedPercent.toFixed(2)}% (Target: ${CARD_WIDTH_UNIT}%)`);
                console.groupEnd();
            }
        };

        const timer = setTimeout(updateMeasurements, 200);
        window.addEventListener('resize', updateMeasurements);
        return () => {
            window.removeEventListener('resize', updateMeasurements);
            clearTimeout(timer);
        };
    }, []);

    const handlePrev = () => {
        if (index > 0) setIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (index < items.length - 1) setIndex((prev) => prev + 1);
    };

    const onDragEnd = (event: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset < -DRAG_BUFFER || velocity < -500) {
            handleNext();
        } else if (offset > DRAG_BUFFER || velocity > 500) {
            handlePrev();
        }
    };

    // --- UPDATED LAYOUT FORMULA ---
    // Instead of %, we use calc(var(--vw) * UNIT)
    //
    // Logic: 
    // 1. Center of screen is 50 * var(--vw)
    // 2. Half of card is (85 * var(--vw)) / 2 = 42.5 * var(--vw)
    // 3. Start pos (offset) = 50 - 42.5 = 7.5 * var(--vw)
    // 4. Shift per item = (Card Width) + Gap
    //                   = (85 * var(--vw)) + 16px

    const xOffset = `calc((50% - (var(--vw, 1vw) * ${CARD_WIDTH_UNIT / 2})) - ${index} * ((var(--vw, 1vw) * ${CARD_WIDTH_UNIT}) + ${GAP_PIXELS}px))`;

    return (
        <div
            ref={containerRef}
            className={clsx("relative w-full", height)}
        >
            {/* TRACK */}
            <motion.div
                className="flex gap-4 items-center h-full py-8 w-full"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                animate={{ x: xOffset }}
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
                            width: `calc(var(--vw, 1vw) * ${CARD_WIDTH_UNIT})`
                        }}
                        animate={{
                            scale: i === index ? 1 : 0.95,
                            opacity: i === index ? 1 : 0.6
                        }}
                    >
                        <Card {...item} height="h-full" />
                    </motion.div>
                ))}
            </motion.div>

            {/* FLOATING NAVIGATION BUTTONS (Neobrutalist) */}

            {/* PREV BUTTON */}
            <div className="absolute left-0 z-50 top-1/2 -translate-y-1/2">
                <button
                    onClick={handlePrev}
                    disabled={index === 0}
                    className={clsx(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 border-2",
                        index === 0
                            ? "bg-zinc-300 border-zinc-400 text-zinc-500 cursor-not-allowed"
                            : "bg-white border-black text-black shadow-neobrutalist hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neobrutalist-hover active:translate-x-0 active:translate-y-0 active:shadow-neobrutalist"
                    )}
                    aria-label="Previous card"
                >
                    <ArrowBackIcon className="w-6 h-6" />
                </button>
            </div>

            {/* NEXT BUTTON */}
            <div className="absolute right-0 z-50 top-1/2 -translate-y-1/2">
                <button
                    onClick={handleNext}
                    disabled={index === items.length - 1}
                    className={clsx(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 border-2",
                        index === items.length - 1
                            ? "bg-zinc-300 border-zinc-400 text-zinc-500 cursor-not-allowed"
                            : "bg-white border-black text-black shadow-neobrutalist hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neobrutalist-hover active:translate-x-0 active:translate-y-0 active:shadow-neobrutalist"
                    )}
                    aria-label="Next card"
                >
                    <ArrowForwardIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};