import ArrowBack from "@mui/icons-material/ArrowBack";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RoomCoordinates } from "@/types/types";
import { motion } from "motion/react";
import { AffineTransform2D, MapPinData } from "@/components/map/CampusMap";
import CampusMap from "@/components/map/CampusMap";
import { CampusMapZentrum } from "@/public/maps/CampusMapZentrum";


const MAP_DIMENSIONS = { width: 1342, height: 1034 };

const ETH_ZENTRUM_TRANSFORM: AffineTransform2D = {
    a: 119431.10532923735,
    b: -2614.4130506312517,
    c: -896492.3090148221,
    d: -720.2021583997647,
    e: -177225.46168129853,
    f: 8403263.698618982,
};

const ViewOnMap = ({
    location,
    image = "/images/image_placeholder.jpg",
    visible = true,
    onClose = () => { },

}: {
    location: string;
    image: string;
    visible?: boolean;
    onClose?: () => void;
}) => {
    const [show, setShow] = useState(visible);
    const [pins, setPins] = useState<MapPinData[]>([]);

    const fetchLocation = async () => {
        if (!location || location.trim().length === 0) {
            console.warn("ViewOnMap: no location provided, skipping fetch");
            return;
        }

        try {
            const encodedRoom = encodeURIComponent(location.trim());
            const url = `/api/geolocation/${encodedRoom}`;

            const res = await fetch(url, { method: "GET" });

            if (!res.ok) {
                let message = `Failed to fetch location: ${res.status} ${res.statusText}`;

                try {
                    const errorResponse = await res.json();
                    if (typeof errorResponse?.error === "string") {
                        message = errorResponse.error;
                    }
                } catch {
                }

                console.error(message);
                return;
            }

            const data = (await res.json()) as RoomCoordinates;

            const normalizedImage = image.startsWith("/") ? image.slice(1) : image;
            const newPins: MapPinData[] = [
                {
                    id: "0",
                    position: data,
                    img: normalizedImage,
                },
            ];

            setPins(newPins);
        } catch (err) {
            console.error("Failed to fetch location:", err);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [location]);

    useEffect(() => {
        if (visible) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [visible]);

    const handleClose = () => {
        setShow(false);
        onClose();
    };

    return createPortal(
        <motion.div
            className="fixed top-0 left-0 w-screen h-[calc(var(--vh,1vh)*100)] z-40 pointer-events-auto"
            initial={{ x: "100%" }}
            animate={{ x: show ? 0 : "100%" }}
            transition={{ type: "tween", ease: "easeInOut" }}
        >
            {/* main part */}
            <div
                className={clsx(
                    "absolute top-0 left-0 w-full h-full",
                    visible ? "opacity-100" : "opacity-0",
                )}
            >
                {/* Header */}
                <div className="absolute top-0 left-0 w-full h-32 z-60">
                    <div className="relative">
                        <h1 className="absolute top-12 left-0 w-full h-8 text-center content-center text-2xl font-semibold text-white-border">
                            View on map
                        </h1>
                        <button
                            className="absolute top-12 left-3 w-8 h-8 flex items-center justify-center"
                            onClick={() => handleClose()}
                        >
                            <ArrowBack fontSize="large" />
                        </button>
                    </div>
                </div>

                {/* Main body */}
                {pins !== null && pins.length > 0 && (
                    <CampusMap
                        zoomControlsOffset={{ x: 22, y: 22 }}
                        geoToPixelTransform={ETH_ZENTRUM_TRANSFORM}
                        MapComponent={CampusMapZentrum}
                        mapPixelDimensions={MAP_DIMENSIONS}
                        pins={pins}
                        initialCenter={pins[0].position}
                        initialZoom={3}
                        zBase={40}
                    />
                )}
            </div>
        </motion.div>,
        document.body
    );
};

export default ViewOnMap;
