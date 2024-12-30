export function videoDuration(duration) {
    if (isNaN(duration) || duration < 0) {
        console.error("Not a valid positive number");
        return;
    }

    const secDuration = Math.floor(duration);
    const hours = Math.floor(secDuration / 3600);
    const minutes = Math.floor((secDuration % 3600) / 60);
    const seconds = secDuration % 60;

    const pad = (num) => String(num).padStart(2, "0");

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    } else {
        return `${pad(minutes)}:${pad(seconds)}`;
    }
}
