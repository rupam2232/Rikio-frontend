export function formatViews(views = 1) {
    if (isNaN(views) || views < 0) {
        console.error("Not a valid positive number");
        return;
    }

    if (views >= 1_000_000_000) {
        return `${(views / 1_000_000_000).toFixed(views % 1_000_000_000 === 0 ? 0 : 1)}B`;
    } else if (views >= 1_000_000) {
        return `${(views / 1_000_000).toFixed(views % 1_000_000 === 0 ? 0 : 1)}M`;
    } else if (views >= 1_000) {
        return `${(views / 1_000).toFixed(views % 1_000 === 0 ? 0 : 1)}K`;
    } else {
        return `${views}`;
    }
}
