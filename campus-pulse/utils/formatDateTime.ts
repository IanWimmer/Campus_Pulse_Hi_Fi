const WEEKDAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export function formatEventDateTime(
    isoString: string,
    now: Date = new Date()
): string {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return ""; // invalid date guard

    // --- Helpers ---
    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const formatTime = (d: Date) => {
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`; // 24h format
    };

    const timeStr = formatTime(date);

    // --- Today / Tomorrow ---
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (isSameDay(date, today)) {
        return `Today, ${timeStr}`;
    }

    if (isSameDay(date, tomorrow)) {
        return `Tomorrow, ${timeStr}`;
    }

    // --- Same week (Monday–Sunday) ---
    // Start of current week (Monday)
    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay(); // 0 = Sunday, 1 = Monday, ...
    const diffToMonday = (dayOfWeek + 6) % 7; // 0 for Monday
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (date >= startOfWeek && date <= endOfWeek) {
        const weekdayName = WEEKDAY_NAMES[date.getDay()];
        return `This ${weekdayName}, ${timeStr}`;
    }

    // --- Default: dd.MM., HH:mm ---
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");

    return `${day}.${month}., ${timeStr}`;
}
