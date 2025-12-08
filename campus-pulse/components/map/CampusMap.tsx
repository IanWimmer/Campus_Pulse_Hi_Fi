"use client";

import React, { useState, useRef, useEffect } from "react";
import ZoomIn from "@mui/icons-material/ZoomIn";
import ZoomOut from "@mui/icons-material/ZoomOut";

import Pin from "./Pin";


export type GeoCoordinate = {
    lat: number;
    lon: number;
};

export type MapPinData = {
    id: string | number;
    position: GeoCoordinate;
    img: string;
};

export type AffineTransform2D = {
    // x = a * lon + b * lat + c
    a: number;
    b: number;
    c: number;
    // y = d * lon + e * lat + f
    d: number;
    e: number;
    f: number;
};

interface CampusMapProps {
    MapComponent: React.FC<React.SVGProps<SVGSVGElement>>;
    mapPixelDimensions: { width: number; height: number };
    geoToPixelTransform: AffineTransform2D;
    pins: MapPinData[];
    initialCenter?: GeoCoordinate;
    minZoom?: number;
    maxZoom?: number;
    initialZoom?: number;
    zoomControlsOffset?: { x: number; y: number };
}


const latLonToPixel = (
    geo: GeoCoordinate,
    t: AffineTransform2D
): { x: number; y: number } => {
    const { lat, lon } = geo;
    const { a, b, c, d, e, f } = t;

    const x = a * lon + b * lat + c;
    const y = d * lon + e * lat + f;

    return { x, y };
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

const CampusMap: React.FC<CampusMapProps> = ({
    MapComponent,
    mapPixelDimensions,
    geoToPixelTransform,
    pins,
    initialCenter,
    minZoom = 0.2,
    maxZoom = 4,
    initialZoom = 1.5,
    zoomControlsOffset = { x: 20, y: 20 },
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [initialized, setInitialized] = useState(false);

    const lastPos = useRef<{ x: number; y: number } | null>(null);

    // --- Initialization: fit map & optionally center a geographic position ---
    useEffect(() => {
        if (!containerRef.current || initialized) return;

        const containerW = containerRef.current.clientWidth;
        const containerH = containerRef.current.clientHeight;

        const baseScaleX = containerW / mapPixelDimensions.width;
        const baseScaleY = containerH / mapPixelDimensions.height;
        const fittedScale = Math.min(baseScaleX, baseScaleY);

        // Apply initialZoom multiplier and clamp
        let startScale = fittedScale * initialZoom;
        startScale = clamp(startScale, minZoom, maxZoom);

        let startOffsetX: number;
        let startOffsetY: number;

        if (initialCenter) {
            const { x: mapX, y: mapY } = latLonToPixel(
                initialCenter,
                geoToPixelTransform
            );
            startOffsetX = containerW / 2 - mapX * startScale;
            startOffsetY = containerH / 2 - mapY * startScale;
        } else {
            startOffsetX =
                (containerW - mapPixelDimensions.width * startScale) / 2;
            startOffsetY =
                (containerH - mapPixelDimensions.height * startScale) / 2;
        }

        setScale(startScale);
        setOffset({ x: startOffsetX, y: startOffsetY });
        setInitialized(true);
    }, [
        containerRef,
        geoToPixelTransform,
        initialCenter,
        mapPixelDimensions.height,
        mapPixelDimensions.width,
        minZoom,
        maxZoom,
        initialized,
        initialZoom,
    ]);

    // --- Panning ---

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        containerRef.current?.setPointerCapture(e.pointerId);
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !lastPos.current) return;
        e.preventDefault();

        const deltaX = e.clientX - lastPos.current.x;
        const deltaY = e.clientY - lastPos.current.y;

        setOffset((prev) => ({
            x: prev.x + deltaX,
            y: prev.y + deltaY,
        }));

        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        lastPos.current = null;
        containerRef.current?.releasePointerCapture(e.pointerId);
    };

    // --- Zooming (core math) ---

    /**
     * Zoom while keeping the world point under `focal` in the same
     * screen position (focal.x, focal.y) relative to the container.
     *
     * factor > 1  => zoom in
     * factor < 1  => zoom out
     */
    const zoomWithFactor = (factor: number, focal?: { x: number; y: number }) => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const rect = container.getBoundingClientRect();

        const oldScale = scale;
        const newScale = clamp(oldScale * factor, minZoom, maxZoom);
        if (newScale === oldScale) return;

        // Choose zoom center:
        // - wheel: focal from mouse position
        // - buttons: center of the container
        const fx =
            focal?.x ?? rect.width / 2;
        const fy =
            focal?.y ?? rect.height / 2;

        // Convert focal screen point to world coordinates
        const worldX = (fx - offset.x) / oldScale;
        const worldY = (fy - offset.y) / oldScale;

        // New offset so that world point stays under same screen point
        const newOffsetX = fx - worldX * newScale;
        const newOffsetY = fy - worldY * newScale;

        setScale(newScale);
        setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleWheel = (e: React.WheelEvent) => {
        // Don't call preventDefault here -> avoids passive listener warning.
        if (!containerRef.current) return;

        const zoomSpeed = 0.001;
        const delta = -e.deltaY * zoomSpeed; // wheel up = zoom in
        const factor = 1 + delta;

        const rect = containerRef.current.getBoundingClientRect();
        const focal = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        zoomWithFactor(factor, focal);
    };

    const handleZoomIn = () => {
        zoomWithFactor(1.2); // around center
    };

    const handleZoomOut = () => {
        zoomWithFactor(1 / 1.2); // around center
    };

    // --- Render ---

    const mapWidth = mapPixelDimensions.width * scale;
    const mapHeight = mapPixelDimensions.height * scale;

    const PIN_TIP_X = 29.5;
    const PIN_TIP_Y = 77;

    const pinRenderList = pins
        .map((pin) => {
            const { x: mapX, y: mapY } = latLonToPixel(
                pin.position,
                geoToPixelTransform
            );

            const screenX = offset.x + mapX * scale;
            const screenY = offset.y + mapY * scale;

            return { pin, screenX, screenY };
        })
        .sort((a, b) => a.screenY - b.screenY);

    const dottedBackground: React.CSSProperties = {
        backgroundColor: "#ffffff",
        backgroundImage:
            "radial-gradient(#E2E2E2 1px, transparent 2px)",
        backgroundSize: "24px 24px",
        backgroundPosition: "0 0",
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full overflow-hidden relative touch-none select-none"
            style={dottedBackground}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
        >
            {/* Map SVG */}
            <div
                className="absolute top-0 left-0"
                style={{
                    width: mapWidth,
                    height: mapHeight,
                    transform: `translate(${offset.x}px, ${offset.y}px)`,
                    transformOrigin: "top left",
                }}
            >
                <MapComponent className="w-full h-full block" />
            </div>

            {/* Pins */}
            {pinRenderList.map(({ pin, screenX, screenY }) => (
                <div
                    key={pin.id}
                    className="absolute z-10 pointer-events-none"
                    style={{
                        left: screenX,
                        top: screenY,
                        transform: `translate(${-PIN_TIP_X}px, ${-PIN_TIP_Y}px)`,
                    }}
                >
                    <Pin imgPath={pin.img} />
                </div>
            ))}

            {/* Zoom Controls */}
            <div
                className="absolute flex flex-col gap-2 z-20 pointer-events-auto"
                style={{
                    bottom: zoomControlsOffset.y,
                    right: zoomControlsOffset.x,
                }}
            >
                <button
                    onClick={handleZoomIn}
                    className="border-black bg-white text-black p-2 rounded-full border-2 flex items-center justify-center w-12 h-12"
                >
                    <ZoomIn fontSize="medium" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="border-black bg-white text-black p-2 rounded-full border-2 flex items-center justify-center w-12 h-12"
                >
                    <ZoomOut fontSize="medium" />
                </button>
            </div>
        </div>
    );
};

export default CampusMap;
