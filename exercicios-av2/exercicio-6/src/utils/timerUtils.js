export function formatTime(ms) {
    ms = Math.max(0, ms);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    const pad = n => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(milliseconds)}`;
}

export function getInputValueMs(mode, { h, m, s }) {
    h = h || 0;
    m = m || 0;
    s = s || 0;

    if (mode === 2) {
        return (h * 3600 + m * 60 + s) * 1000;
    } else if (mode === 3) {
        const now = new Date();
        const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s, 0);

        if (targetDate.getTime() < now.getTime()) {
            targetDate.setDate(targetDate.getDate() + 1);
        }
        return targetDate.getTime();
    }
    return 0;
}