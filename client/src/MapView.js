import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { exportToPDF } from './exportToPDF';

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

        const day = prompt("Day of the trip (ex. 1):");
        const time = prompt("Time of the visit (ex. 10:00): ");
        const priority = parseInt(prompt("Priority: "), 10);

        const newPoint = {
            ...latlng,
            label,
            day: parseInt(day, 10) || 1,
            time: time || "12:00",
            priority: isNaN(priority) ? markers.length + 1 : priority,
        };

        const newMarkers = [...markers, newPoint];
        newMarkers.sort((a, b) => a.priority - b.priority);
        newMarkers.sort((a, b) => a.priority - b.priority);

        setMarkers(newMarkers);
        if (newMarkers.length >= 2) {
            fetchRouteFromORS(newMarkers);
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

    return (
        <>
            <div style={{ margin: '10px 0' }}>
                <button onClick={() => exportToPDF(markers)}>Export to PDF</button>
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
                            <strong>{marker.label}</strong><br />
                            Day: {marker.day}<br />
                            Time: {marker.time}<br />
                            Priority: {marker.priority}
                        </Popup>
                    </Marker>
                ))}

                {routes.map((segment, idx) => (
                    <Polyline
                        key={idx}
                        positions={segment.coords}
                        color={segment.mode === 'foot-walking' ? 'green' : 'blue'}
                    />
                ))}
            </MapContainer>
        </>
    );
};

export default MapView;
