"use client";

import { useEffect, useState } from "react";

import { EventType } from "@/types/types";
import CampusMap, { GeoCoordinate, MapPinData, AffineTransform2D } from "@/components/map/CampusMap";
import { CampusMapZentrum } from "@/public/maps/CampusMapZentrum";

// --- Configuration ---

const MAP_DIMENSIONS = { width: 1342, height: 1034 };

const INITIAL_CENTER: GeoCoordinate = { lat: 47.37725219458089, lon: 8.548436963403903 };

const ETH_ZENTRUM_TRANSFORM: AffineTransform2D = {
    a: 119431.10532923735,
    b: -2614.4130506312517,
    c: -896492.3090148221,
    d: -720.2021583997647,
    e: -177225.46168129853,
    f: 8403263.698618982,
};

type EventWithGeo = EventType & {
    geo: { lat: number; lon: number } | null;
};

export default function MapPage() {
    const [pins, setPins] = useState<MapPinData[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/eventsWithGeo");
                if (!res.ok) {
                    console.error("Failed to fetch eventsWithGeo:", res.statusText);
                    return;
                }

                const events: EventWithGeo[] = await res.json();

                // Build MapPinData[] from events that have geo coordinates
                const newPins: MapPinData[] = events
                    .filter((e) => e.geo)
                    .map((e) => ({
                        id: e.id,
                        position: {
                            lat: e.geo!.lat,
                            lon: e.geo!.lon,
                        },
                        // Remove leading slash so Pin component, which prefixes with "/", works:
                        img: e.image_path.replace(/^\//, ""),
                    }));

                setPins(newPins);
            } catch (err) {
                console.error("Error fetching eventsWithGeo:", err);
            }
        };

        void fetchEvents();
    }, []);

    return (
        <div className="relative w-full h-[calc(var(--vh,1vh)*100)]">
            <h1 className="absolute top-0 left-0 w-full text-center text-2xl font-semibold text-white-border pointer-events-none pt-10 z-20">
                Discover events on campus
            </h1>

            <CampusMap
                zoomControlsOffset={{ x: 22, y: 150 }}
                geoToPixelTransform={ETH_ZENTRUM_TRANSFORM}
                MapComponent={CampusMapZentrum}
                mapPixelDimensions={MAP_DIMENSIONS}
                pins={pins}
                initialCenter={INITIAL_CENTER}
                initialZoom={3}
            />
        </div>
    );
}