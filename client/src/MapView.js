import React, {useState} from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents} from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import {exportToPDF} from './exportToPDF';

const ORS_API_KEY = '5b3ce3597851110001cf624861d25d39d0a6457d99564006dd4be1ad';

const icon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MapClickHandler({ onAddMarker }) {
    useMapEvents({
        click(e) {
            onAddMarker(e.latlng);
        }
    });
    return null;
}

const MapView = () => {
    const [markers, setMarkers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [transportMode, setTransportMode] = useState('');

    const addMarker = (latlng) => {
        const label = prompt("Place name:");
        if (!label) return;

        const newPoint = {
            ...latlng,
            label
        };

        const newMarkers = [...markers, newPoint];
        const sorted = sortMarkersbyDistance(newMarkers);
        setMarkers(sorted);

        if (newMarkers.length >= 2) {
            setRoutes([]);
            generateRoutes(sorted);
        }
    };

    const calculateDistance = (p1, p2) => {
        const R = 6371000;
        const toRad = (deg) => deg * Math.PI / 180;

        const dLat = toRad(p2.lat - p1.lat);
        const dLon = toRad(p2.lng - p1.lng);

        const lat1 = toRad(p1.lat);
        const lat2 = toRad(p2.lat);

        const a = Math.sin(dLat / 2) ** 2 +
            Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const sortMarkersbyDistance = (points) => {
        if (points.length <= 2) return points;

        const visited = [points[0]];
        const unvisited = points.slice(1);

        while (unvisited.length) {
            const last = visited[visited.length - 1];
            let nearestIdx = 0;
            let nearestDistance = calculateDistance(last, unvisited[0]);

            for (let i = 1; i < unvisited.length; i++) {
                const distance = calculateDistance(last, unvisited[i]);
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestIdx = i;
                }
            }
            visited.push(unvisited.splice(nearestIdx, 1)[0]);
        }
        return visited;
    };

    const generateRoutes = async (sortedPoints) => {
        for (let i = 1; i < sortedPoints.length; i++) {
            await fetchRouteFromORS([sortedPoints[i - 1],sortedPoints[i]]);
        }
    }

    const fetchRouteFromORS = async (points) => {
        if (points.length < 2) return;

        const last = points[points.length - 1];
        const secondLast = points[points.length - 2];
        const coordinates = [
            [secondLast.lng, secondLast.lat],
            [last.lng, last.lat]
        ];

        const distance = calculateDistance(secondLast, last);
        let mode = distance < 1000 ? 'foot-walking' : 'driving-car';
        setTransportMode(mode);

        const body = {
            coordinates,
            instructions: false,
            geometry: true
        };

        try {
            console.log('Sending to ORS:', coordinates);
            const response = await axios.post(
                `https://api.openrouteservice.org/v2/directions/${mode}/geojson`,
                body,
                {
                    headers: {
                        'Authorization': ORS_API_KEY,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const coords = response.data.features[0].geometry.coordinates.map(
                ([lng, lat]) => [lat, lng]
            );

            setRoutes(prev => [...prev, { coords, mode }]);
        } catch (err) {
            console.error('ORS error:', err.response?.data || err.message);
            alert('Failed to download route from ORS.');
        }
    };

    const setLastRouteAsTransit = () => {
        setRoutes(prevRoutes => {
            if (prevRoutes.length === 0) return prevRoutes;

            return prevRoutes.map((segment, idx) => {
                return {
                    ...segment,
                    mode: idx === prevRoutes.length - 1 ? 'transit' : segment.mode
                };
            });
        });
    };

    const getColorByMode = (mode) => {
        switch (mode) {
            case 'foot-walking': return 'green';
            case 'transit': return 'purple';
            case 'driving-car':
            default: return 'blue';
        }
    };

    return (
        <>
            <div style={{ margin: '10px 0' }}>
                <button onClick={() => exportToPDF(markers)}>Export to PDF</button>
                <button onClick={setLastRouteAsTransit}> Set last segment as Public Transport</button>
            </div>

            <MapContainer center={[52.2297, 21.0122]} zoom={6} style={{ height: '600px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onAddMarker={addMarker} />
                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={[marker.lat, marker.lng]}
                        icon={icon}>
                        <Popup>
                            <strong>{marker.label}</strong>
                        </Popup>
                    </Marker>
                ))}

                {routes.map((segment, idx) => (
                    <Polyline
                        key={`${idx}-${segment.mode}`}
                        positions={segment.coords}
                        color={getColorByMode(segment.mode)}
                    />
                ))}
            </MapContainer>
        </>
    );
};

export default MapView;
