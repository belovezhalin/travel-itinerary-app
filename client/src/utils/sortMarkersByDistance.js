import { calculateDistance } from './calculateDistance';

export const sortMarkersByDistance = (points) => {
    if (points.length <= 2) return points;

    const visited = [points[0]];
    const unvisited = points.slice(1);

    while (unvisited.length) {
        const last = visited[visited.length - 1];
        let nearestIdx = 0;
        let nearestDistance = calculateDistance(last, unvisited[0]);

        for (let i = 1; i < unvisited.length; i++) {
            const dist = calculateDistance(last, unvisited[i]);
            if (dist < nearestDistance) {
                nearestDistance = dist;
                nearestIdx = i;
            }
        }
        visited.push(unvisited.splice(nearestIdx, 1)[0]);
    }

    return visited;
};