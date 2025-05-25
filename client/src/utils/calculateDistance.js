export const calculateDistance = (p1, p2) => {
    const R = 6371000;
    const toRad = deg => deg * Math.PI / 180;

    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lng - p1.lng);
    const lat1 = toRad(p1.lat);
    const lat2 = toRad(p2.lat);

    const a = Math.sin(dLat / 2) ** 2 +
        Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};