export default function formatNumbers(number = 0) {
    if (isNaN(number) || number < 0) {
        console.error("Not a valid positive number");
        return 0;
    }

    if (number >= 1_000_000_000) {
        return `${(number / 1_000_000_000).toFixed(number % 1_000_000_000 === 0 ? 0 : 1)}B`;
    } else if (number >= 1_000_000) {
        return `${(number / 1_000_000).toFixed(number % 1_000_000 === 0 ? 0 : 1)}M`;
    } else if (number >= 1_000) {
        return `${(number / 1_000).toFixed(number % 1_000 === 0 ? 0 : 1)}K`;
    } else {
        return `${number}`;
    }
}
