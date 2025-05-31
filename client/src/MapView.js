import React, { useState, useEffect } from 'react';
import { sortMarkersByDistance } from './utils/sortMarkersByDistance';
import { fetchRoute } from './utils/fetchRoute';

import SideBar from './components/SideBar';
import MapPanel from './components/MapPanel';

import './App.css';

const MapView = ({ user, itinerary, saveItinerary: saveToProp, isViewMode = itinerary !== null }) => {
    const [days, setDays] = useState([{ id: 1, markers: [], routes: [] }]);
    const [currentDayId, setCurrentDayId] = useState(1);

    useEffect(() => {
        if (itinerary && itinerary.days) {
            const formattedDays = itinerary.days.map(day => ({
                id: day.id,
                markers: day.markers || [],
                routes: day.routes || []
            }));

            setDays(formattedDays);
            setCurrentDayId(formattedDays[0]?.id || 1);
        }
    }, [itinerary]);

    const getCurrentDay = () => days.find(d => d.id === currentDayId);
    const current = getCurrentDay();

    const addNewDay = () => {
        const newId = days.length + 1;
        setDays([...days, { id: newId, markers: [], routes: [] }]);
        setCurrentDayId(newId);
    };

    const deleteCurrentDay = () => {
        if (days.length === 1) return alert("At least one day is required.");
        const confirmDelete = window.confirm(`Delete Day ${currentDayId}?`);
        if (!confirmDelete) return;

        const updatedDays = days.filter(day => day.id !== currentDayId);
        setDays(updatedDays);
        setCurrentDayId(updatedDays[0]?.id || 1);
    };

    const addMarker = async (latlng) => {
        const label = prompt("Place name:");
        if (!label) return;

        const updated = [...current.markers, { ...latlng, label }];
        const sorted = sortMarkersByDistance(updated);
        const newRoutes = await buildRoutes(sorted);

        updateCurrentDay({ markers: sorted, routes: newRoutes });
    };

    const editMarker = async (index) => {
        const label = prompt("New name:");
        if (!label) return;

        const updated = [...current.markers];
        updated[index] = { ...updated[index], label };

        const sorted = sortMarkersByDistance(updated);
        const newRoutes = await buildRoutes(sorted);

        updateCurrentDay({ markers: sorted, routes: newRoutes });
    };

    const deleteMarker = async (index) => {
        const updated = current.markers.filter((_, i) => i !== index);
        const sorted = sortMarkersByDistance(updated);
        const newRoutes = await buildRoutes(sorted);

        updateCurrentDay({ markers: sorted, routes: newRoutes });
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;

        const reordered = Array.from(current.markers);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);

        const newRoutes = await buildRoutes(reordered);
        updateCurrentDay({ markers: reordered, routes: newRoutes });
    };

    const buildRoutes = async (markers) => {
        const routes = [];
        for (let i = 1; i < markers.length; i++) {
            const segment = await fetchRoute(markers[i - 1], markers[i]);
            if (segment) routes.push(segment);
        }
        return routes;
    };

    const updateCurrentDay = (data) => {
        setDays(prev =>
            prev.map(day =>
                day.id === currentDayId
                    ? { ...day, ...data }
                    : day
            )
        );
    };

    const handleSaveItinerary = async (title, daysData, isPublic) => {
        try {
            console.log('Zapisywana struktura:', {
                title,
                days: daysData,
                isPublic
            });
            const response = await fetch('/api/itineraries', {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    days: daysData,
                    isPublic
                })
            });

            if (response.ok) {
                alert('The itinerary has been saved!');
            } else {
                alert('Failed to save the itinerary.');
            }
        } catch (error) {
            console.error('Error while saving itinerary:', error);
            alert('An error occurred while saving the itinerary.');
        }
    };

    const saveCurrentItinerary = () => {
        const title = prompt('Enter the itinerary name:');
        if (!title) return;

        const isPublic = window.confirm('Do you want to make this itinerary public?');

        if (saveToProp) {
            saveToProp(title, days, isPublic);
        } else {
            handleSaveItinerary(title, days, isPublic);
        }
    };

    const getColorByMode = (mode) => {
        switch (mode) {
            case 'foot-walking': return 'green';
            case 'transit': return 'purple';
            case 'driving-car': return 'blue';
            default: return 'gray';
        }
    };

    return (
        <div style={{ display: 'flex', height: 650 }}>
            <SideBar
                days={days}
                currentDayId={currentDayId}
                setCurrentDayId={setCurrentDayId}
                addNewDay={addNewDay}
                deleteCurrentDay={deleteCurrentDay}
                onDragEnd={onDragEnd}
                saveCurrentItinerary={saveCurrentItinerary}
            />
            <MapPanel
                current={current}
                addMarker={addMarker}
                editMarker={editMarker}
                deleteMarker={deleteMarker}
                updateCurrentDay={updateCurrentDay}
                getColorByMode={getColorByMode}
                isViewMode={isViewMode}
            />
        </div>
    );
};

export default MapView;