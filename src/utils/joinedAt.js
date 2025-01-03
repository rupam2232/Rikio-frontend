export default function joinedAt(joinedDate) {
    const date = new Date(joinedDate);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${monthName} ${year}`;
}