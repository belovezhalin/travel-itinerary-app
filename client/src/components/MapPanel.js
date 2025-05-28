import React, { useEffect, useRef, useState } from 'react';
import {MapContainer, Marker, Popup, TileLayer, Polyline, useMap} from 'react-leaflet';
import { MapClickHandler } from './MapClickHandler';
import L from 'leaflet';
import SearchBar from './SearchBar';
import {fetchRoute} from "../utils/fetchRoute";
import MapController from './MapController';

import '../styles/MapPanel.css';

const createNumberedIcon = (number) =>
    L.divIcon({
        html: `<div class="marker-number">${number}</div>`,
        className: 'custom-number-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

function FitMarkersBounds({ markers }) {
    const map = useMap();

    useEffect(() => {
        if (markers && markers.length > 0) {
            const bounds = L.latLngBounds(markers.map(marker => [marker.lat, marker.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);

    return null;
}

export default function MapPanel({ current, addMarker, editMarker, deleteMarker, updateCurrentDay, getColorByMode }) {
    const [mapInstance, setMapInstance] = useState(null);
    const mapRef = useRef(null);

    const editNotes = async (idx) => {
        const notes = prompt("Edit notes:", current.markers[idx].notes || "") || "";
        if (notes === null) return;

        const updated = [...current.markers];
        updated[idx] = { ...updated[idx], notes };

        const sorted = updated;
        const newRoutes = await (async () => {
            const routes = [];
            for (let i = 1; i < sorted.length; i++) {
                const segment = await fetchRoute(sorted[i - 1], sorted[i]);
                if (segment) routes.push(segment);
            }
            return routes;
        })();
        updateCurrentDay({ markers: sorted, routes: newRoutes });
    };

    const handleMapReference = (map) => {
        mapRef.current = map;
    }

    return (
        <div style={{ width: '67%', minWidth: 400 }}>
            <SearchBar mapRef={{ current: mapInstance}} />
            <MapContainer
                center={[52.2297, 21.0122]}
                zoom={6} style={{ height: '100%', width: '100%' }}
                ref={handleMapReference}
            >
                <MapController setMapInstance={setMapInstance} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onAddMarker={addMarker} />

                {current.markers && current.markers.length > 0 &&
                    <FitMarkersBounds markers={current.markers} />
                }

                {current.markers.map((marker, idx) => (
                    <Marker key={idx} position={[marker.lat, marker.lng]} icon={createNumberedIcon(idx + 1)}>
                        <Popup>
                            <div>
                                <strong>{`${idx + 1}. ${marker.label}`}</strong><br />
                                <button onClick={(e) => { e.stopPropagation(); editMarker(idx); }}>✏️ Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); editNotes(idx); }}>📝 Make notes</button>
                                <button onClick={(e) => { e.stopPropagation(); deleteMarker(idx); }}>🗑️ Delete</button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {current.routes.map((segment, idx) => (
                    <Polyline
                        key={`${idx}-${segment.mode}`}
                        positions={segment.coords}
                        color={getColorByMode(segment.mode)}
                    />
                ))}
            </MapContainer>
        </div>
    );
}