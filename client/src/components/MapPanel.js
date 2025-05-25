import React from 'react';
import { MapContainer, Marker, Popup, TileLayer, Polyline } from 'react-leaflet';
import { MapClickHandler } from './MapClickHandler';
import L from 'leaflet';

import '../styles/MapPanel.css';

const createNumberedIcon = (number) =>
    L.divIcon({
        html: `<div class="marker-number">${number}</div>`,
        className: 'custom-number-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });

export default function MapPanel({ current, addMarker, editMarker, deleteMarker, getColorByMode }) {
    return (
        <div style={{ width: '67%', minWidth: 400 }}>
            <MapContainer center={[52.2297, 21.0122]} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickHandler onAddMarker={addMarker} />
                {current.markers.map((marker, idx) => (
                    <Marker key={idx} position={[marker.lat, marker.lng]} icon={createNumberedIcon(idx + 1)}>
                        <Popup>
                            <div>
                                <strong>{`${idx + 1}. ${marker.label}`}</strong><br />
                                <button onClick={(e) => { e.stopPropagation(); editMarker(idx); }}>✏️ Edit</button>
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