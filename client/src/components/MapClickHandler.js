import { useMapEvents } from 'react-leaflet';

export function MapClickHandler({ onAddMarker }) {
    useMapEvents({
        click(e) {
            onAddMarker(e.latlng);
        }
    });
    return null;
}