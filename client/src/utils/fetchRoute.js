import axios from 'axios';
import { calculateDistance } from './calculateDistance';

const ORS_API_KEY = '5b3ce3597851110001cf624861d25d39d0a6457d99564006dd4be1ad';

export const fetchRoute = async (from, to) => {
    const coordinates = [[from.lng, from.lat], [to.lng, to.lat]];
    const mode = calculateDistance(from, to) < 1000 ? 'foot-walking' : 'driving-car';

    try {
        const res = await axios.post(
            `https://api.openrouteservice.org/v2/directions/${mode}/geojson`,
            { coordinates, instructions: false, geometry: true },
            {
                headers: {
                    'Authorization': ORS_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            coords: res.data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]),
            mode
        };
    } catch (err) {
        console.error('ORS error:', err.response?.data || err.message);
        alert('Failed to download route from ORS.');
        return null;
    }
};