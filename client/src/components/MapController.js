import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function MapController({ setMapInstance }) {
    const map = useMap();

    useEffect(() => {
        setMapInstance(map);
    }, [map, setMapInstance]);

    return null;
}